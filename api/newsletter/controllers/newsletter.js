'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  subscribe: async (ctx) => {
    const { email } = ctx.params;
    const entity = await strapi.services["email-prijemci"].findOne({nazev: "Newsletter"})
    let alreadyExists = false;
    if (entity.prijemci.length > 0) {
      alreadyExists = !!entity.prijemci.find((prijemce) => prijemce.email === email);
    }
    if (!alreadyExists) {
      let prijemci = [...entity.prijemci, {email}]
      await strapi.services["email-prijemci"].update(
        { id: entity.id },
        { prijemci }
      );
    } else {
      return {message: "User already exists", success: false}
    }

    console.log(entity)
    return "found";
  }
};
