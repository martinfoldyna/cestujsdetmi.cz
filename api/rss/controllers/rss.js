'use strict';
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({stdTTL: 60, checkperiod: 90});

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const rss = myCache.get("rss");

    const keys = myCache.keys()


    if (rss === undefined) {
      return { success: false, data: [], error: {status: 404, statusMessage: "Not Found"} }
    }

      return { success: true, data: rss.objects, error: null }

  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const cache = await strapi.services.rss.getRssFromStorage();

    if (cache.objects) {
      const foundItem = cache.objects.find(objektItem => objektItem.id === id)
      return foundItem ? foundItem : null
    } else {
      return cache
    }
  }
};
