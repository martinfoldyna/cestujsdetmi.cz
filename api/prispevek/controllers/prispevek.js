'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    await strapi.plugins.email.services.email.send({
      to: 'martifoldyna@gmail.com',
      from: 'admin@strapi.io',
      subject: 'Comment posted that contains a bad words',
      text: `
          The comment contain a bad words.
        `,
    });

    return "strapi"
  }
};
