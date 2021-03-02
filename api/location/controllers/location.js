const { sanitizeEntity } = require("strapi-utils/lib");

module.exports = {
  async findAll(ctx) {
    let finalRes = { mesta: [], kraje: [], oblasti: [], kategorie: [] };
    const cityEntities = await strapi
      .query("mesto")
      .model.find(ctx.query)
      .select("value key");

    finalRes.mesta = cityEntities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.mesto })
    );

    const krajEntities = await strapi
      .query("kraj")
      .model.find(ctx.query)
      .select("value key");

    finalRes.kraje = krajEntities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.kraj })
    );

    const oblastEntites = await strapi
      .query("oblast")
      .model.find(ctx.query)
      .select("value key");

    finalRes.oblasti = oblastEntites.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.oblast })
    );

    const categoryEntities = await strapi.services.kategorie.find();
    finalRes.kategorie = categoryEntities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.kategorie })
    );

    return finalRes;
  },
};
