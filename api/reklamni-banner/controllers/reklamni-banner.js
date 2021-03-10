"use strict";

const { sanitizeEntity } = require("strapi-utils/lib");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  findActive: async () => {
    const todayISO = new Date().toISOString();
    console.log(todayISO);
    const entities = await strapi.services["reklamni-banner"].find({
      datum_zobrazeni_od_gt: todayISO,
      datum_zobrazeni_do_lt: todayISO,
    });
    // return entities.map((entity) =>
    //   sanitizeEntity(entity, { model: strapi.models["reklamni-banner"] })
    // );
  },
};
