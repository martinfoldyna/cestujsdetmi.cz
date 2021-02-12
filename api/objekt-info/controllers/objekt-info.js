'use strict';
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;


const {convertToValue} = require("../../../helpers/helpers");
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  // Called before entry is created
  beforeCreate: async (data) => {
    data.hodnota = convertToValue(data);
  },
  /**
   * Push new review to object
   * @return {Object|Array}
   */
  async addReview(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["objekt-info"].update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services["objekt-info"].update({ id }, ctx.request.body);
    }

    await strapi.plugins["email"].services.email.send({to: "martifoldyna@gmail.com", from: "admin@cestujsdetmi.cz", subject: `Thank you for reviewing ${ctx.request.body.nazev}!`, text: "Thank you very much for helping out community to grow."})

    return sanitizeEntity(entity, { model: strapi.models["objekt-info"] });
  },

  async findMini(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["objekt-info"].search(ctx.query);
    } else {
      entities = await strapi.services["objekt-info"].find(ctx.query, ["Nazev"]);
    }

    // return entities.map(entity => sanitizeEntity(entity, {
    //   model: strapi.models["objekt-info"],
    // }))

    // TODO: Simplify removing by object keys and array
    return entities.map(entity => {
      const objekt = sanitizeEntity(entity, {
        model: strapi.models["objekt-info"],
      });

      const skipItems = ["vnitrni_vybaveni", "vnejsi_vybaveni", "dostupnost", "recenze", "cenik", "slevy", "zajimavosti", "popis"];

      const objektKeys = Object.keys(objekt);

      for (let key of objektKeys) {
        if (skipItems.indexOf(key) > -1) {
          delete objekt[key]
        }
      }
      return objekt;
    });
  },
  async findMiniByOblast(ctx) {
    let {oblastId} = ctx.params;
    // let entities;
    // if (ctx.query._q) {
    //   entities = await strapi.services["objekt-info"].search(ctx.query);
    // } else {
    //   entities = await strapi.services["objekt-info"].find({adresa[]}, ["Nazev"]);
    // }
    const objects = await this.findMini(ctx);
    if (objects) {
      const filteredObjects = objects.filter(item => {
        return item.adresa && item.adresa.oblast && item.adresa.oblast.key === oblastId
      })
      return filteredObjects
    } else {
      return null
    }
  },

  async importOldDb(ctx) {

    // const objekty = await Promise.all(data.map(post => new Promise(async (resolve, reject) => {
    //   try {
    //     const created = await strapi.services["objekt-info"].create(post);
    //     resolve(created);
    //   } catch (err) {
    //     reject(err)
    //   }
    // })))

    const client = await MongoClient.connect("mongodb://localhost:27017",  { useUnifiedTopology: true });


      const db = client.db("cestujsdetmi")

      // const posts = await db.collection("new_new").find({"id": {$gte: 0, $lte: 50}}).toArray();

    const post = await db.collection("new_new").findOne({"id": 1});
      const uzivatel = await strapi.plugins['users-permissions'].services.user.fetch({id: post.uzivatel});
      const kraj = await strapi.services["kraj"].findOne({id: post.kraj});
      const oblast = await strapi.services["oblast"].findOne({id: post.oblast});
      const statistiky = [];
      for (let key in post) {
        if (key.includes("statistika_")) {
          statistiky.push({nazev: key.replace("statistika_", ""), pocet_zobrazeni: post[key]})
        }
      }

      const created = await strapi.services["objekt-info"].create({...post, ...{createdAt: new Date(post.createdAt), updatedAt: new Date(post.createdAt), dostupnost: {mhd: post.mhd, vlak: post.vlak, metro: post.metro, csad: post.csad}, uzivatel, kraj, oblast, statistiky} });




    return { created, message: "imported"}

  },
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["objekt-info"].create(data, { galerie: files });
    } else {
      entity = await strapi.services["objekt-info"].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models["objekt-info"] });
  },
};
