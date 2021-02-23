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
