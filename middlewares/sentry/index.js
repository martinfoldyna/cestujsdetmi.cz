module.exports = strapi => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          console.log(err);
          await next()
        }
      });
    },
  };
};
