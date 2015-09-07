const koa = require('koa'),
  router = require('koa-router'),
  sm = require('sitemap'),
  siteConfig = require('./config/pagesSettings.js'),
  bodyParser = require('koa-bodyparser');


//----- Sitemap
const pages = [];

for (var page in siteConfig) {
  if (page === '/')
  	continue;

  pages.push({
  	url: '/' + page,
  	changefreq: 'daily',
  });
}

const sitemap = sm.createSitemap({
  hostname: 'http://lstory.org',
  cacheTime: 600000,        // 600 sec - cache purge period
  urls: pages,
});

//-----

const app = koa();

// app.use(function *checkTime(next) {
//   var start = new Date();

//   yield next;

//   var ms = new Date - start;
//   console.log('%s %s - %s', this.method, this.url, ms);
// });

app.use(bodyParser());
app.use(router(app));

app.get('/sitemap.xml', function *(req, res) {
  this.set('Content-Type', 'application/xml');
  this.body = sitemap.toString();
});

app.use(require('koa-static')('./client'));

app.on('error', function(err, ctx) {
  console.log('Error is occured: ', err);
});

module.exports = app;
