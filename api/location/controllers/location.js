const { sanitizeEntity } = require("strapi-utils/lib");

module.exports = {
  async findAll(ctx) {
    let finalRes = { mesta: [], kraje: [], oblasti: [], kategorie: [], ads: [] };
    const cityEntities = await strapi
      .query("mesto")
      .model.find(ctx.query)
      .select("value key kraj_id");
    finalRes.mesta = cityEntities.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    });

    const today = new Date();

    const adsQuery = {
      _sort: "datum_zobrazeni_do:DESC",
      datum_zobrazeni_od_lte: today.toISOString(),
      datum_zobrazeni_do_gte: today.toISOString()
    }

    finalRes.ads = await strapi.services["reklamni-banner"].find(adsQuery)

    const krajEntities = await strapi
      .query("kraj")
      .model.find(ctx.query)
      .select("value key old_id");

    finalRes.kraje = krajEntities.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    });

    const oblastEntites = await strapi
      .query("oblast")
      .model.find(ctx.query)
      .select("value key kraj");

    finalRes.oblasti = oblastEntites.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    });

    const categoryEntities = await strapi.services.kategorie.find(ctx.query);
    finalRes.kategorie = categoryEntities.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    });

    return finalRes;
  },
};
