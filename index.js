const db = require('./server/db'),
  app = require('./server/lib/app'),
  jade = require('jade'),
  tagMap = require('./server/db/tagMap'),
  request = require('co-request'),
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

  .get('/getStoriesForModeration', function *() {
    this.body = JSON.stringify( yield getArticlesForModeration() );
  })

  .get('/myStory', function *() {

    var compile = jade.compileFile('./server/views/myStory.jade');
    this.body = compile();
  })

  .get('/moderation', function *() {

    var compile = jade.compileFile('./server/views/moderation.jade');
    this.body = compile();
  })

  .get('/', function *() {

    var compile = jade.compileFile('./server/views/index.jade');
    this.body = compile();

  })

  .post('/createStory', function *() {
    var body = this.request.body;
    console.log('body is: ', body);

    this.assert(body.grecaptcha, 403, {message: 'Подтвердите что вы не робот'});
    this.assert(body.title && body.text, 403, {message: 'Ошибка запроса'});

    this.assert(body.title.length > 5, 403, {message: 'Слишком короткий заголовок'});
    this.assert(body.title.length < 100, 403, {message: 'Много букв в заголовке'});

    this.assert(body.text.length > 500, 403, {message: 'Напишите подробнее'});
    this.assert(body.text.length < 3000, 403, {message: 'История слишком длинная'});

    var urlString = 'https://www.google.com/recaptcha/api/siteverify?' +
      'secret=' + config.secret +
      '&response=' + body.grecaptcha +
      '&remoteip=' + this.request.ip;



    var captchaResult = yield request(urlString);
    console.log('captchaResult is: ', captchaResult.body);

    yield addArticleToSandbox(body.title, body.text);

    this.body = '';
  });

app.listen(3000);

function* addArticleToSandbox(title, text, tags) {
  yield db.Sandbox.create({
    header: title.toString(),
    text: text.toString(),
  });
}

function* getArticlesForModeration() {
  return yield db.Sandbox.findAll({
    attributes: ['id', 'header', 'text', 'createdAt'],
    where: {
      status: null,
    },
    order: [['id', 'DESC']],
    limit: 10,
  }).then(function(rows) {
    return rows.map(function(v) {
      return {
        id: v.id,
        header: v.header,
        text: v.text,
        createdAt: v.createdAt,
      };
    });
  });
}

function* articlesGetter(tags, lastStory) {

  var lastStoryObj = lastStory ? {
    id: {
      $lt: +lastStory,
    },
  } : {};

  var tagObjectForQuery = margeObjects( translateTagsToQueryObj(tags), lastStoryObj );

  return yield db.Article.findAll({
    limit: 10,
    where: tagObjectForQuery,
    order: [['id', 'DESC']],
  }).then(function(rows) {

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
  });


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
