'use strict';
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({stdTTL: 60, checkperiod: 90});

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const rss = await strapi.services.rss.getRssFromStorage();

    console.log(rss.data)


    if (rss.data === undefined) {
      return { success: false, data: [], error: {status: 404, statusMessage: "Not Found"} }
    }

      return { success: true, data: rss.data, error: null }

  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const rss = await strapi.services.rss.fetchRssById(id);

    return rss
  }
};
