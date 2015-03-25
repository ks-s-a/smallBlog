const app = require('./app'),
  config = require('./config'),
  jade = require('jade'),
  react = require('react'),
  request = require('co-request'),
  routerLib = require('./lib/routerLib');

app
  .get('/getStoriesNumber', function *() {
    var tags = this.query.tags ? JSON.parse(this.query.tags) : null;

    this.body = JSON.stringify( yield routerLib.getArticlesNumber(tags) );
  })

  .get('/getStories', function *() {
    var tags = this.query.tags ? JSON.parse(this.query.tags) : null;
    var lastStory = this.query.last || null;

    this.body = JSON.stringify( yield routerLib.articlesGetter(tags, lastStory) );
  })

  .get('/getStoriesForModeration', function *() {
    this.body = JSON.stringify( yield routerLib.getArticlesForModeration() );
  })

  .get('/myStory', function *() {

    var compile = jade.compileFile('./server/views/myStory.jade');
    this.body = compile();
  })

  .get('/moderation', function *() {

    var compile = jade.compileFile('./server/views/moderation.jade');
    this.body = compile();
  })

  .post('/moderateStory', function *() {
    var body = this.request.body;

    if (body.action === 'false') {
      yield routerLib.removeArticleFromSandbox(+body.storyId);
    }

    else if (body.action === 'true') {
      this.assert(body.tags, 400, {message: 'Не отмечены тэги статьи!'});

      yield routerLib.approveSandboxArticle(+body.storyId, body.title, body.text, JSON.parse(body.tags) );
    }

    else {
      this.throw(400, {message: 'Непонятный запрос!'});
    }

    this.body = '';
  })

  .get('/', function *() {
    var from = +this.query.from || null;

    var storyLastId = yield routerLib.lastStoryId();
    var lastTenStories = yield routerLib.articlesGetter(null, from);
    var storiesMap = yield routerLib.getArticlesNumber();
    var prevLink = from && (from + 10) < storyLastId ?
      '/?from=' + (from + 10) :
      (from + 10) === storyLastId ? '/' : false;
    var nextLink = from ?
      from > 10 ? '/?from=' + (from - 10) : false :
      storyLastId > 10 ? '/?from=' + (storyLastId - 10) : false;

    var reactElement = react.createElement( require('./reactComponents/main.js'), {
      stories: lastTenStories,
    } );

    var compileDataObj = {
      data: {
        init: JSON.stringify({
          storiesCount: storiesMap,
          stories:  lastTenStories,
        }),
        prevLink: prevLink,
        nextLink: nextLink,
        html: react.renderToString( reactElement ),
      },
    };

    var compile = jade.compileFile('./server/views/index.jade');
    this.body = compile(compileDataObj);
  })

  .post('/createStory', function *() {
    var body = this.request.body;

    this.assert(body.grecaptcha, 403, {message: 'Подтвердите что вы не робот'});
    this.assert(body.title && body.text, 403, {message: 'Ошибка запроса'});

    this.assert(body.title.length > 5, 403, {message: 'Слишком короткий заголовок'});
    this.assert(body.title.length < 100, 403, {message: 'Много букв в заголовке'});

    // Decoding and screening danger symbols
    body.text = decodeURIComponent(body.text)
      .replace(/&/g,'&lt;')
      .replace(/</g,'&amp;');


    this.assert(body.text.length > 500, 403, {message: 'Напишите подробнее'});
    this.assert(body.text.length < 3000, 403, {message: 'История слишком длинная'});

    var urlString = 'https://www.google.com/recaptcha/api/siteverify?' +
      'secret=' + config.secret +
      '&response=' + body.grecaptcha +
      '&remoteip=' + this.request.ip;

    var captchaResult = yield request(urlString);

    yield routerLib.addArticleToSandbox(body.title, body.text);

    this.body = '';
  });

module.exports = app;
