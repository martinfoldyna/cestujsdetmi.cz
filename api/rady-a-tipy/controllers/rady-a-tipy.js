'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const sanitizeEntity = require("strapi-utils/lib/sanitize-entity");
module.exports = {

  async getRelated(ctx) {
    if(ctx.query.tags) {
      const tagsQuery = ctx.query.tags;
      const tagsQueryArr = tagsQuery.includes(",") ? tagsQuery.split(",") : [tagsQuery];
      console.log(tagsQueryArr)
      let entities = [];
      delete ctx.query.tags
      const findInDB = async (tag) => {
          return await strapi.services["rady-a-tipy"].find({...ctx.query, _limit: parseInt(ctx.query._limit), page_keywords_contains: tag})
      }

      for (const tag of tagsQueryArr) {
        entities = [...entities, ...await findInDB(tag)];
      }
      return entities
    } else {
     return await strapi.services["rady-a-tipy"].search(ctx.query)
    }

  },

  getPaths: async (ctx) => {
    const entities = await strapi
      .query("rady-a-tipy")
      .model.find(ctx.query)
      .select("hodnota kategorie -galerie");
    return entities
  },

  async findOne(ctx) {
    const { hodnota } = ctx.params;

    const entity = await strapi.query("rady-a-tipy")
      .model.findOne({hodnota});
    return entity;
  },
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  findPromo: async (ctx) => {
    const entities = await strapi
      .query("rady-a-tipy")
      .model.find({ promo: true })
      .select("hodnota nazev promo kategorie perex image_filename")
      .sort({ createdAt: "desc" });

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models["rady-a-tipy"] }));
  },
};
