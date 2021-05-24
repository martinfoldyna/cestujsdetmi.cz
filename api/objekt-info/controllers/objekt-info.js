"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async findOne(ctx) {
    const { hodnota } = ctx.params;

    const entity = await strapi.services["objekt-info"].findOne({ hodnota });
    return sanitizeEntity(entity, {
      model: strapi.models['objekt-info'],
    });
  },

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
  async findMini(ctx) {
    const sort = ctx.query._sort ? ctx.query._sort.split(",").join(" ") : {};
    const filter = ctx.query._filter;
    const skip = parseInt(ctx.query._start);
    const limit = parseInt(ctx.query._limit);
    delete ctx.query._sort;
    delete ctx.query._filter;
    delete ctx.query._start;
    delete ctx.query._limit;
    const entities = await strapi
      .query("objekt-info")
      .model.find(
        { ...ctx.query },
        "-statistiky -provozni_doba -slevy -dostupnost -ceny -vnejsi_vybaveni -vnitrni_vybaveni -vnitrni_vybaveni_popis -vnejsi_vybaveni_popis -last_minute_odkaz -last_minute_popis -zajimavosti -web -telefon -email -popis -kraj_id -last_minute -uzivatel",
        { skip, limit }
      )
      .populate({ path: "kraj", select: "value" })
      .populate({ path: "mesto", select: "value" })
      .populate({ path: "oblast", select: "value" })
      .sort(sort)
    return entities;
  },
  async findLastMinute(ctx) {
    const limit = parseInt(ctx.query._limit);
    delete ctx.query._limit;
    const entities = await strapi
      .query("objekt-info")
      .model.find(
        { last_minute_popis: { $ne: null }, druh_zapisu: "04_premium_gold" },
        "-statistiky -provozni_doba -slevy -dostupnost -ceny -vnejsi_vybaveni -vnitrni_vybaveni -vnitrni_vybaveni_popis -vnejsi_vybaveni_popis -last_minute_odkaz -zajimavosti -web -telefon -email -popis -kraj_id -last_minute -uzivatel -kraj -mesto -oblast -galerie -active_until -page_keywords -page_description -relative_galerie",
        {limit}
      )
      .sort("-druh_zapisu -created_at")

    return entities;
  },
  async findPaths(ctx) {
    const entities = await strapi
      .query("objekt-info").model.find({...ctx.query}, "-statistiky -provozni_doba -slevy -dostupnost -ceny -vnejsi_vybaveni -vnitrni_vybaveni -relative_galerie -vnitrni_vybaveni_popis -vnejsi_vybaveni_popis -last_minute_odkaz -last_minute_popis -zajimavosti -web -telefon -email -popis -kraj_id -last_minute -uzivatel -active -druh_zapisu -galerie -updated_at -created_at -active_until -page_keywords -page_description -page_title -zakladni_popis -podkategorie_value -kategorie_value -gps -adresa_ulice -nazev -hlavni_kategorie -adresa -podkategorie -recenze -__v -kraj -mesto -oblast -updated_by")
    return entities;


  },
  async fullText(ctx) {
    const ubytovani = await strapi
      .query("objekt-info").model.find({ "nazev": {"$regex": ctx.params.name, "$options": "i"}, "typ_objektu": "ubytovani" }).limit(10).populate({path: "kraj", select: "value"}).populate({path:"mesto", select: "value"})

    const vylety = await strapi
      .query("objekt-info").model.find({ "nazev": {"$regex": ctx.params.name, "$options": "i"}, "typ_objektu": "zabava" }).limit(10).populate({path: "kraj", select: "value"}).populate({path:"mesto", select: "value"})

    return { ubytovani, vylety };
  }
};
