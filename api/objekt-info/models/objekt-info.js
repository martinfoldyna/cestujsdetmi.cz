'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const slugify = require("slugify");
module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      console.log(data)
      if (data.nazev && !data.hodnota) {
        data.hodnota = slugify(data.nazev.toLowerCase());
      }
    },
    beforeUpdate: async (params, data) => {
      console.log(data)
      if (data.nazev && !data.hodnota) {
        data.hodnota = slugify(data.nazev.toLowerCase());
      }
    },
  },
};
