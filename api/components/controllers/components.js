'use strict';

/**
 * A set of functions called "actions" for `components`
 */

module.exports = {
  find: async (ctx, next) => {
    try {
      const component = strapi.components["vnitrni-vybaveni"];

      console.log(component)

      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
