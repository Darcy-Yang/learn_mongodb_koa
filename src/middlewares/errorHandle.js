export default () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { msg: err.msg || err.message || err.toString() };
  }
};
