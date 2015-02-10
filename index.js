const db = require('./server/db'),
  app = require('./server/lib/app'),
  jade = require('jade'),
  Sequa
  tagMap = require('./server/db/tagMap');

console.log('db successefully created!');

function *articlesGetter(tags) {

  var tagObjectForQuery = translateTagsToQueryObj(tags);
  var rows = yield db.Article.findAll({
    //limit: 3,
    where: tagObjectForQuery,
    order: [['id', 'DESC']],
  });

  return rows.map(function(v) {
    return {
      id: v.dataValues.id,
      header: v.dataValues.header,
      text: v.dataValues.text,
    }})
}

function *getArticlesNumber(tags) {
  var tagObjectForQuery = translateTagsToQueryObj(tags);
  var resultObject = {};

  var activeTagsNumber = yield db.Article.count({
    where: tagObjectForQuery,
  });

  console.log('activeTagsNumber is: ', activeTagsNumber);
  console.log('tags is: ', tags);

  for (var tag in tagMap) {
    resultObject[tag] = tags.indexOf(+tag) !== -1 ?

      activeTagsNumber :

      yield db.Article.count({
        where: db.Sequelize.and(
          tagObjectForQuery,
          Object.defineProperty({}, tagMap[tag], {value:true})
        ),
      });
  }

  console.log(resultObject);
  return resultObject;
}

function translateTagsToQueryObj(tags) {
  var objForQuery = {};

  for (var index in tags) {
    objForQuery[ tagMap[ +tags[index] ] ] = true;
  }

  return objForQuery;
}

app
  .get('/getStoriesNumber', function *() {
    var tags = this.query.tags ? JSON.parse(this.query.tags) : null;

    this.status = 200;
    this.body = JSON.stringify( yield getArticlesNumber(tags) );

  })

  .get('/getStories', function *() {
    var tags = this.query.tags ? JSON.parse(this.query.tags) : null;

    this.status = 200;
    this.body = JSON.stringify( yield articlesGetter(tags) );

  })

  .get('/', function *() {

    var compile = jade.compileFile('./server/views/index.jade');
    this.body = compile();

  });

app.listen(3000);
