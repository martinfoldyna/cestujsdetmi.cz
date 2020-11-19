'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const sanitizeEntity = require("strapi-utils/lib/sanitize-entity");
module.exports = {
  async findLite(ctx) {

    let entities;
      entities = await strapi.services.prispevek.search(ctx.query);
    console.log(entities)

    return entities;
  }
};
