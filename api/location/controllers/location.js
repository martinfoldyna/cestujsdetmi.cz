const { sanitizeEntity } = require("strapi-utils/lib");

module.exports = {
  async findAll(ctx) {
    let finalRes = { mesta: [], kraje: [], oblasti: [], kategorie: [] };
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
    }).map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.mesto })
    );

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
    }).map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.kraj })
    );

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
    }).map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.oblast })
    );

    const categoryEntities = await strapi.services.kategorie.find(ctx.query);
    finalRes.kategorie = categoryEntities.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    }).map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.kategorie })
    );

    return finalRes;
  },
};
