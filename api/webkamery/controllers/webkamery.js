'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  getPaths: async (ctx) => {
    const entities = await strapi
      .query("webkamery")
      .model.find(ctx.query)
      .select("hodnota");
    return entities
  },
  async findOne(ctx) {
    const { hodnota } = ctx.params;

    const entity = await strapi.services["objekt-info"].findOne({ hodnota });
    return entity;
  },
};
