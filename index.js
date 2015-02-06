const db = require('./server/db/index.js'),
  app = require('./server/lib/app'),
  jade = require('jade');

console.log('db successefully created!');

articlesGetter = function *() {

  var rows = yield db.Article.findAll({
    //limit: 3,
    order: [['id', 'DESC']],
  });

  return rows.map(function(v) {
    return {
      id: v.dataValues.id,
      header: v.dataValues.header,
      text: v.dataValues.text,
    }})
};

app
  .get('/getStories', function *() {

    this.status = 200;
    this.body = JSON.stringify( yield articlesGetter );

  })

  .get('/', function *() {

    var compile = jade.compileFile('./server/views/index.jade');
    this.body = compile();

  });

app.listen(3000);
