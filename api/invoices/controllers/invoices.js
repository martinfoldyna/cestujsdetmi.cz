'use strict';

/**
 * A set of functions called "actions" for `invoices`
 */

module.exports = {
  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }
  send: async (ctx, next) => {

    try {
      await strapi.services.invoices.create(ctx.request.body);

      return "generated"
    } catch (err) {
      console.log(err)
      throw err
    }

  }
};
