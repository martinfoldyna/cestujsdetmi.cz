module.exports = async (ctx, next) => {
  return ctx.unauthorized("You are not logged in!")
}
