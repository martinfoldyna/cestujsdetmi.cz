'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const slugify = require("slugify");

const generateValue = (name) => {
  const today = new Date();
  return `${today.getFullYear()}${today.getMonth()}${today.getDate()}-${slugify(
    name.trim().toLowerCase()
  )}`
}

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.nazev && !data.hodnota) {
        let newValue = generateValue(data.nazev)
        const doesExist = await strapi.services["objekt-info"].find({hodnota: newValue});
        if (doesExist) {
          newValue += '-2'
        }
        data.hodnota = newValue;
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.nazev && !data.hodnota) {
        data.hodnota = generateValue(data.nazev);
      }
    },
  },
};
