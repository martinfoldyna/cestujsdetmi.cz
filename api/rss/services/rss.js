'use strict';
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({stdTTL: 60, checkperiod: 90});
const axios = require("axios");


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  fetchRss: async () => {
    try {
      const response = await axios.get(`https://www.kudyznudy.cz/services/public/activities.ashx?key=${process.env.RSS_KEY}`);
      const { data } = response;
      return { success: true, data, error: null };
    } catch (error) {
      return { success: false, data: [], error }
    }

  },
  fetchRSSandSave: async () => {
    const rss = await strapi.services.rss.fetchRss();
    if (rss.success) {
      const save = await strapi.services.rss.saveRss(rss.data);
      return save
    } else {
      return rss
    }
  },
  saveRss: async (data) => {
    try {
      const obj = {objects: data, createdAt: new Date()}

      const success = myCache.set("rss", obj)

      return { success: true, data: obj, error: null };
    } catch (error) {
      return { success: false, data: [], error }
    }
  },
  getRssFromStorage: async () => {
    try {
      const rss = myCache.get( "rss" );


      if (rss === undefined) {
        return { success: false, data: [], error: {status: 404, statusMessage: "Not Found"} }
      } else {
        return { success: true, data: rss.objects, error: null }
      }
    } catch (error) {
      return { success: false, data: [], error }
    }
  }
};
