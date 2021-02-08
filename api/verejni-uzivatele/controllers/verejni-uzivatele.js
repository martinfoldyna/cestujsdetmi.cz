'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const sanitizeEntity = require("strapi-utils/lib/sanitize-entity");
module.exports = {
  async addToFavorite(ctx) {
    const { email } = ctx.params;

    let entity;

    let user = await strapi.services["verejni-uzivatele"].findOne({email})
    const body = ctx.request.body;
    let finalUpdateBody = {}

    let finalFavorite = [];
    let finalExternalFavorite = []
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
      finalUpdateBody.oblibene = finalFavorite.length > 0 ?
        user.oblibene && user.oblibene.length > 0
          ? [...user.oblibene, ...finalFavorite]
          : [...finalFavorite]
        : user.oblibene
    }

      if (body.oblibene_externi) {
        body.oblibene_externi.forEach(item => {
          const foundFavoriteItem = user.oblibene_externi.find((favoriteItem) => {
            console.log("favoriteId", favoriteItem.foreign_id);
            console.log("paramId", item);
            return favoriteItem.hotId === item.id;
          });
          if (!foundFavoriteItem) {
            finalExternalFavorite.push(item);
          }
        })

        finalUpdateBody.oblibene_externi = finalExternalFavorite.length > 0 ?
          user.oblibene_externi && user.oblibene_externi.length > 0
            ? [...user.oblibene_externi, ...finalExternalFavorite]
            : finalExternalFavorite
          : user.oblibene_externi;
      }






    if (finalFavorite.length > 0 || finalExternalFavorite.length >0) {
      entity = await strapi.services["verejni-uzivatele"].update(
        { _id: user._id },
        finalUpdateBody
      );
    }

    return sanitizeEntity(entity, { model: strapi.models["verejni-uzivatele"] });
  },
  async removeFavorite(ctx) {
    const {email} = ctx.params;
    const {body} = ctx.request;

    let user = await strapi.services["verejni-uzivatele"].findOne({email})

    const updateBody = {};

    if (body.hotId) {
      updateBody.oblibene_externi =  user.oblibene_externi && user.oblibene_externi.length > 0
        ? user.oblibene_externi.filter(item => item.hotId !== body.hotId) :[]
    }

    if (body.localId) {
      updateBody.oblibene = user.oblibene && user.oblibene.length > 0
        ? user.oblibene.filter(item => item.id !== body.localId) :[]
    }

    const entity = await strapi.services["verejni-uzivatele"].update(
      { _id: user._id },
      updateBody
    );

    return sanitizeEntity(entity, { model: strapi.models["verejni-uzivatele"] });

  },
  async update(ctx) {
    const { email } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services["verejni-uzivatele"].update({ email }, data, {
        files,
      });
    } else {
      entity = await strapi.services["verejni-uzivatele"].update({ email }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models["verejni-uzivatele"] });
  },
};
