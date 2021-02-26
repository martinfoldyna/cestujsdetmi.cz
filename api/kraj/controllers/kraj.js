'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {sanitizeEntity} = require("strapi-utils");
module.exports = {
  findWithoutObjects: async (ctx) => {
      const entities = await strapi.query('kraj').model.find().select("value key old_id");
      return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.kraj }));
  },
  findWoObjectsWKrajs: async (ctx) => {
    const entities = await strapi.query('kraj').model.find(ctx.query).select("value key old_id kraj");
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.kraj }));

  }
};
