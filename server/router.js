'use strict';

const app = require('./app'),
  config = require('./config'),
  cash = require('./lib/cashLib')(),
  jade = require('jade'),
  React = require('react'),
  request = require('co-request'),
  routerLib = require('./lib/routerLib'),
  tagNames = require('./reactComponents/config.js');

// Use one object for jadeTemplates prerendering
const jadeTemplates = {
  main: jade.compileFile('./server/views/index.jade'),
  myStory: jade.compileFile('./server/views/myStory.jade'),
  moderation: jade.compileFile('./server/views/moderation.jade'),
};

app

  // AJAX queries -v-
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

  // Site pages -v-
  .get('/myStory', function *() {
    this.body = jadeTemplates.myStory();
  })

  .get('/moderation', function *() {
    const compileData = {
      data: {
        tagNames: JSON.stringify(tagNames),
      }
    };

    this.body = jadeTemplates.moderation(compileData);
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
    // Cash for 1 hour
    if ( cash.check('main', 1) )
      return cash.get('main');

    const compileDataObj = yield routerLib.getPageContent('main');
    const result = jadeTemplates.main(compileDataObj);

    cash.set('main', result);
    this.body = result;
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
