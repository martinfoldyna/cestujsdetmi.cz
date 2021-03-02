"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
module.exports = {
  findWithoutObjects: async (ctx) => {
    const entities = await strapi
      .query("oblast")
      .model.find()
      .select("value key");
    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.oblast })
    );
  },
  findWoObjectsWKrajs: async (ctx) => {
    const entities = await strapi
      .query("oblast")
      .model.find(ctx.query)
      .select("value key kraj");
    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.oblast })
    );
  },
};
