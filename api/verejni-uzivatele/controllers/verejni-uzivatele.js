"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const sanitizeEntity = require("strapi-utils/lib/sanitize-entity");
module.exports = {
  async addToFavorite(ctx) {
    const { email } = ctx.params;

    let entity;

    //TODO: Simplify

    let user = await strapi.services["verejni-uzivatele"].findOne({ email });
    const body = ctx.request.body;
    let finalUpdateBody = {};

    let finalFavorite = [];
    let finalExternalFavorite = [];
    let finalRecommendations = [];
    if (body.oblibene) {
      body.oblibene.forEach((item, index) => {
        const foundFavoriteItem = user.oblibene.find((favoriteItem) => {
          console.log("favoriteId", favoriteItem.id);
          console.log("paramId", item);
          return favoriteItem.id === item;
        });
        if (!foundFavoriteItem) {
          finalFavorite.push(item);
        }
      });
      finalUpdateBody.oblibene =
        finalFavorite.length > 0
          ? user.oblibene && user.oblibene.length > 0
            ? [...user.oblibene, ...finalFavorite]
            : [...finalFavorite]
          : user.oblibene;
    }

    if (body.oblibene_externi) {
      body.oblibene_externi.forEach((item) => {
        const foundFavoriteItem = user.oblibene_externi.find((favoriteItem) => {
          console.log("favoriteId", favoriteItem.foreign_id);
          console.log("paramId", item);
          return favoriteItem.hotId === item.id;
        });
        if (!foundFavoriteItem) {
          finalExternalFavorite.push(item);
        }
      });

      finalUpdateBody.oblibene_externi =
        finalExternalFavorite.length > 0
          ? user.oblibene_externi && user.oblibene_externi.length > 0
            ? [...user.oblibene_externi, ...finalExternalFavorite]
            : finalExternalFavorite
          : user.oblibene_externi;
    }

    if (body.rady_a_tipy) {
      body.rady_a_tipy.forEach((item) => {
        const foundFavoriteItem = user.rady_a_tipy.find((favoriteItem) => {
          console.log("favoriteId", favoriteItem.id);
          console.log("paramId", item);
          return favoriteItem.id === item.id;
        });
        if (!foundFavoriteItem) {
          finalRecommendations.push(item);
        }

        finalUpdateBody.rady_a_tipy =
          finalRecommendations.length > 0
            ? user.rady_a_tipy && user.rady_a_tipy.length > 0
              ? [...user.rady_a_tipy, ...finalRecommendations]
              : finalRecommendations
            : user.rady_a_tipy;
      });
    }

    if (body.webkamery) {
      body.webkamery.forEach((item) => {
        const foundFavoriteItem = user.webkamery.find((favoriteItem) => {
          console.log("favoriteId", favoriteItem.id);
          console.log("paramId", item);
          return favoriteItem.id === item.id;
        });
        if (!foundFavoriteItem) {
          finalRecommendations.push(item);
        }

        finalUpdateBody.webkamery =
          finalRecommendations.length > 0
            ? user.webkamery && user.webkamery.length > 0
              ? [...user.webkamery, ...finalRecommendations]
              : finalRecommendations
            : user.webkamery;
      });
    }

    if (
      finalFavorite.length > 0 ||
      finalExternalFavorite.length > 0 ||
      finalRecommendations.length > 0
    ) {
      entity = await strapi.services["verejni-uzivatele"].update(
        { _id: user._id },
        finalUpdateBody
      );
    }

    return sanitizeEntity(entity, {
      model: strapi.models["verejni-uzivatele"],
    });
  },
  async removeFavorite(ctx) {
    const { email } = ctx.params;
    const { body } = ctx.request;

    let user = await strapi.services["verejni-uzivatele"].findOne({ email });

    const updateBody = {};

    if (body.hotId) {
      updateBody.oblibene_externi =
        user.oblibene_externi && user.oblibene_externi.length > 0
          ? user.oblibene_externi.filter((item) => item.hotId !== body.hotId)
          : [];
    }

    if (body.localId) {
      updateBody.oblibene =
        user.oblibene && user.oblibene.length > 0
          ? user.oblibene.filter((item) => item.id !== body.localId)
          : [];
    }

    if (body.webkamery) {
      updateBody.webkamery =
        user.webkamery && user.webkamery.length > 0
          ? user.webkamery.filter((item) => item.id !== body.webkamery)
          : [];
    }

    const entity = await strapi.services["verejni-uzivatele"].update(
      { _id: user._id },
      updateBody
    );

    return sanitizeEntity(entity, {
      model: strapi.models["verejni-uzivatele"],
    });
  },
  async update(ctx) {
    const { email } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["verejni-uzivatele"].update(
        { email },
        data,
        {
          files,
        }
      );
    } else {
      entity = await strapi.services["verejni-uzivatele"].update(
        { email },
        ctx.request.body
      );
    }

    return sanitizeEntity(entity, {
      model: strapi.models["verejni-uzivatele"],
    });
  },
};
