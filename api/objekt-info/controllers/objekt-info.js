"use strict";
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;

const { convertToValue } = require("../../../helpers/helpers");
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Push new review to object
   * @return {Object|Array}
   */
  async addReview(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["objekt-info"].update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services["objekt-info"].update(
        { id },
        ctx.request.body
      );
    }

    await strapi.plugins["email"].services.email.send({
      to: "martifoldyna@gmail.com",
      from: "admin@cestujsdetmi.cz",
      subject: `Thank you for reviewing ${ctx.request.body.nazev}!`,
      text: "Thank you very much for helping out community to grow.",
    });

    return sanitizeEntity(entity, { model: strapi.models["objekt-info"] });
  },

  async findMini(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["objekt-info"].search(ctx.query);
    } else {
      entities = await strapi.services["objekt-info"].find(ctx.query, [
        "Nazev",
      ]);
    }

    // return entities.map(entity => sanitizeEntity(entity, {
    //   model: strapi.models["objekt-info"],
    // }))

    // TODO: Simplify removing by object keys and array
    return entities.map((entity) => {
      const objekt = sanitizeEntity(entity, {
        model: strapi.models["objekt-info"],
      });

      const skipItems = [
        "vnitrni_vybaveni",
        "vnejsi_vybaveni",
        "dostupnost",
        "recenze",
        "cenik",
        "slevy",
        "zajimavosti",
        "popis",
      ];
    });
  },
  async findMiniByOblast(ctx) {
    let { oblastId } = ctx.params;
    // let entities;
    // if (ctx.query._q) {
    //   entities = await strapi.services["objekt-info"].search(ctx.query);
    // } else {
    //   entities = await strapi.services["objekt-info"].find({adresa[]}, ["Nazev"]);
    // }
    const objects = await this.findMini(ctx);
    if (objects) {
      const filteredObjects = objects.filter((item) => {
        return (
          item.adresa &&
          item.adresa.oblast &&
          item.adresa.oblast.key === oblastId
        );
      });
      return filteredObjects;
    } else {
      return null;
    }
  },

  async importOldDb(ctx) {
    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useUnifiedTopology: true,
    });
    const { start, end } = ctx.query;

    const db = client.db("cestujsdetmi");

    // FIRST: -1 -> 50
    const posts = await db
      .collection("new_new")
      .find({ id: { $gte: parseInt(start), $lte: parseInt(end) } })
      .toArray();

    // const post = await db.collection("new_new").findOne({"id": 1});
    const objekty = await Promise.all(
      posts.map(
        (post) =>
          new Promise(async (resolve, reject) => {
            try {
              const alreadyExists = await strapi.services[
                "objekt-info"
              ].findOne({ hodnota: post.hodnota });

              if (!alreadyExists) {
                let foundMesto = post.mesto_id
                  ? await strapi.services["mesto"].findOne({
                      old_id: post.mesto_id,
                    })
                  : null;
                let foundKraj = post.kraj_id
                  ? await strapi.services["kraj"].findOne({
                      old_id: post.kraj_id,
                    })
                  : null;
                let foundOblast = post.oblast_id
                  ? await strapi.services["oblast"].findOne({
                      old_id: post.oblast_id,
                    })
                  : null;

                let mesto = foundMesto ? foundMesto._id : null;
                let kraj = foundKraj ? foundKraj._id : null;
                let oblast = foundOblast ? foundOblast._id : null;
                const provozni_doba =
                  post.provozni_doba && Array.isArray(post.provozni_doba)
                    ? post.provozni_doba.filter((item) => item !== null)
                    : [];
                let slevy = Array.isArray(post.slevy)
                  ? post.slevy.filter((item) => item !== null)
                  : [];
                let ceny = Array.isArray(post.ceny)
                  ? post.ceny.filter((item) => item !== null)
                  : [];
                let statistiky = [];
                for (let key in post) {
                  if (key.includes("statistika_")) {
                    statistiky.push({
                      nazev: key.replace("statistika_", ""),
                      pocet_zobrazeni: post[key],
                    });
                  }
                }

                delete post._id;

                const created = await strapi.services["objekt-info"].create({
                  ...post,
                  ...{
                    created_at:
                      post.createdAt === "0000-00-00 00:00:00"
                        ? new Date(post.first_activation)
                        : new Date(post.createdAt),
                    updated_at:
                      post.createdAt === "0000-00-00 00:00:00"
                        ? new Date(post.first_activation)
                        : new Date(post.createdAt),
                    provozni_doba,
                    statistiky,
                    mesto,
                    oblast,
                    kraj,
                    slevy,
                    ceny,
                    dostupnost: {
                      mhd: post.mhd,
                      vlak: post.vlak,
                      metro: post.metro,
                      csad: post.csad,
                    },
                  },
                });
                resolve(created);
              } else {
                resolve();
              }
            } catch (err) {
              console.log("error at post:", post.id);
              console.log(err);
              reject(err);
            }
          })
      )
    );

    return { count: objekty.length, message: "imported" };
  },
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["objekt-info"].create(data, {
        galerie: files,
      });
    } else {
      entity = await strapi.services["objekt-info"].create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models["objekt-info"] });
  },
  async justMini(ctx) {
    // const entities = await strapi.services["objekt-info"].model
    //   .fetchAll({
    //     columns: ["", "hodnota"],
    //   })
    //   .then((data) => {
    //     let output = data.toJSON();
    //     return output;
    //   });
  },
  async fullText(ctx) {
    const ubytovani = await strapi
      .query("objekt-info").model.find({ "nazev": {"$regex": ctx.params.name, "$options": "i"}, "typ_objektu": "ubytovani" }).limit(10)

    const vylety = await strapi
      .query("objekt-info").model.find({ "nazev": {"$regex": ctx.params.name, "$options": "i"}, "typ_objektu": "zabava" }).limit(10)

    return { ubytovani, vylety };
  }
};
