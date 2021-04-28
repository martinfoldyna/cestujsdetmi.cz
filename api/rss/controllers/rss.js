'use strict';
const helpers = require("../../../helpers/helpers");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


module.exports = {
  async create(ctx) {
    let entity;
    const rssJSONData = await helpers.parseXml(ctx.request.body.EVENT);

    if (Array.isArray(rssJSONData)) {
      entity = [];
      for (let data of rssJSONData.filter(item => item.VHODNEPRORODICESDETMI === "ANO")) {
        const uploadedObject = {
          nazev: data.NAMECZ,
          misto: data.MISTOCZ,
          popis: data.POPISCZ,
          img: data.IMG,
          link: data.LINKCZ,
          dateFrom: data.DATEFROM,
          dateTo: data.DATETO,
        }
        const newEntity = await strapi.services.rss.create(uploadedObject);
        entity.push(newEntity)
      }
    } else {
      entity = await strapi.services.rss.create(ctx.request.body);
    }
    return entity;
  },
  async getPaths(ctx) {
    const entites = await strapi
      .query("rss").model.find()
      .select("id");

    return entites
  }
};
