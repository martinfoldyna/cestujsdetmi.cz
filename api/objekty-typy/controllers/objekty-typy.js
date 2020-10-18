const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOneByValue(ctx) {
    const { value } = ctx.params;

    const entity = await strapi.services["objekty-typy"].findOne({ hodnota: value });
    return entity;
  },
};

