const db = require('./server/db/index.js'),
  jade = require('koa-jade'),
  koa = require('koa');

const app = koa();


console.log('db successefully created!');

app.use(function *checkTime(next) {
  var start = new Date();

  yield next;

  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')('./client'));

app.use(jade.middleware({
  debug: false,
  noCache: true,
  viewPath: __dirname + '/server/views',
}));

app.use(function *articlesGetter(next) {

  var rows = yield db.Article.findAll({
    limit: 3,
    order: [['id', 'DESC']],
  });

  this.state.posts = rows.map(function(v) {
    return {
      id: v.dataValues.id,
      header: v.dataValues.header,
      text: v.dataValues.text,
    }})

  yield next;

});

app.use(function *() {
  var self = this;

  yield this.render('index', {posts: this.state.posts});

  /*this.body = '';

  if (this.state.posts) {
    this.state.posts.forEach(function(v) {
      self.body += 'id: ' + v.dataValues.id + ', header: ' + v.dataValues.header + ', text: ' + v.dataValues.text + '\n';
    });
  }

  else
    this.body += 'Nothing to show!'*/
});

app.on('error', function(err, ctx) {
  console.log('Error is occured: ', err);
})

app.listen(3000);
