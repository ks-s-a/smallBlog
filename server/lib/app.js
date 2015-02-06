const koa = require('koa'),
  router = require('koa-router');

const app = koa();

app.use(function *checkTime(next) {
  var start = new Date();

  yield next;

  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(router(app));
app.use(require('koa-static')('./client'));

app.on('error', function(err, ctx) {
  console.log('Error is occured: ', err);
})

module.exports = app;
