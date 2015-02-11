const db = require('./server/db'),
  app = require('./server/lib/app'),
  jade = require('jade'),
  tagMap = require('./server/db/tagMap');

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

function* articlesGetter(tags) {

  var tagObjectForQuery = translateTagsToQueryObj(tags);
  var rows = yield db.Article.findAll({
    //limit: 3,
    where: tagObjectForQuery,
    order: [['id', 'DESC']],
  });

  return rows.map(function(v) {
    var tags = [];

    for (var tag in tagMap) {
      if (v.dataValues[ tagMap[tag] ]) tags.push(tag);
    }

    return {
      id: v.dataValues.id,
      header: v.dataValues.header,
      tags: tags,
      text: v.dataValues.text,
    }})
}

function* getArticlesNumber(tags) {
  // convert entery array
  var tagObjectForQuery = (tags && tags.length) ? translateTagsToQueryObj(tags) : null;

  var resultObject = {};

  // if tags is not null, count active articles
  if (tagObjectForQuery) {
    var activeTagsNumber = yield db.Article.count({
      where: tagObjectForQuery,
    });
  }

  // craete query to db with sophisticated condition
  for (var tag in tagMap) {
    if (tagObjectForQuery && tagObjectForQuery[ tagMap[tag] ]) {
      resultObject[tag] = activeTagsNumber;
    }

    else if (tagObjectForQuery) {
      var conditionTag = {};
      conditionTag[ tagMap[tag] ] = true;

      resultObject[tag] = yield db.Article.count({
        where: db.Sequelize.and(
            tagObjectForQuery,
            conditionTag
          )
      });
    } else {
      var conditionTag = {};
      conditionTag[ tagMap[tag] ] = true;

      resultObject[tag] = yield db.Article.count({
        where: conditionTag,
      });
    }
  }

  return resultObject;
}

function translateTagsToQueryObj(tags) {
  var objForQuery = {};

  for (var index in tags) {
    objForQuery[ tagMap[ +tags[index] ] ] = true;
  }

  return objForQuery;
}
