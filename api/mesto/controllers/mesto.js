'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  getCityObjekts: async (ctx) => {
    const entities = await strapi.services.mesto.find(ctx.query);
    return entities
  }
};
