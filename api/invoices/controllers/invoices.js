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
    console.log(strapi.services.invoices.create());

    return "generated"
  }
};
