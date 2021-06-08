const { sanitizeEntity } = require("strapi-utils/lib");

const today = new Date();
const todayString = today.toISOString()

module.exports = {
  async findAll(ctx) {
    let finalRes = { mesta: [], kraje: [], oblasti: [], kategorie: [], ads: [] };
    finalRes.mesta = await strapi
      .query("mesto")
      .model.find(ctx.query)
      .select("value key kraj_id").sort("value");

    finalRes.ads = await strapi
      .query("reklamni-banner")
      .model.find({ datum_zobrazeni_od: { $lte: todayString }, datum_zobrazeni_do: {$gte: todayString} }).select("script umisteni")
      .sort("-datum_zobrazeni_do");

    finalRes.kraje = await strapi
      .query("kraj")
      .model.find(ctx.query)
      .select("value key old_id").sort({value: "asc"});

    finalRes.oblasti = await strapi
      .query("oblast")
      .model.find(ctx.query)
      .select("value key kraj").sort({value: "asc"});

    finalRes.kategorie = await strapi
      .query("kategorie")
      .model.find(ctx.query).populate({ path: "podkategorie", select: "nazev hodnota" }).sort({value: "asc"});

    return finalRes;
  },
};
