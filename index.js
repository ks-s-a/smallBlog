const db = require('./server/db'),
  app = require('./server/lib/app'),
  jade = require('jade'),
  tagMap = require('./server/db/tagMap'),
  request = require('request'),
  config = require('./server/config');

app
  .get('/getStoriesNumber', function *() {
    var tags = this.query.tags ? JSON.parse(this.query.tags) : null;

    this.body = JSON.stringify( yield getArticlesNumber(tags) );
  })

  .get('/getStories', function *() {
    var tags = this.query.tags ? JSON.parse(this.query.tags) : null;
    var lastStory = this.query.last || null;

    this.body = JSON.stringify( yield articlesGetter(tags, lastStory) );
  })

  .get('/myStory', function *() {

    var compile = jade.compileFile('./server/views/myStory.jade');
    this.body = compile();
  })

  .get('/', function *() {

    var compile = jade.compileFile('./server/views/index.jade');
    this.body = compile();

  })

  .post('/createStory', function *() {
    var body = this.request.body;

    this.assert(body.title && body.story && body['g-recaptcha-response'], 401, {message: 'Ошибка запроса!'});

    var urlString = 'https://www.google.com/recaptcha/api/siteverify?' +
      'secret=' + config.secret +
      '&response=' + body['g-recaptcha-response'] +
      '&remoteip=' + this.request.ip;

    request(urlString, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
      }
    });

    this.body = '';
  });

app.listen(3000);

function* articlesGetter(tags, lastStory) {

  console.log('lastStory is: ', lastStory);
  var lastStoryObj = lastStory ? {
    id: {
      $lt: +lastStory,
    },
  } : {};

  console.log('lastStoryObj is: ', lastStoryObj);

  var tagObjectForQuery = margeObjects( translateTagsToQueryObj(tags), lastStoryObj );

  console.log('tagObjectForQuery is: ', tagObjectForQuery);
  var rows = yield db.Article.findAll({
    limit: 10,
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

// Merge all properties for all object, passing in the functnion
function margeObjects() {
  var objectArr = Array.prototype.slice.call(arguments);

  if (!objectArr.length) return {};

  return objectArr.reduce(function(p, c) {
    if (c && Object.keys(c).length) {
      for (var i in c) {
        p[i] = c[i];
      }
    }

    return p;
  }, {});
}
