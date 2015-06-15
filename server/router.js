const app = require('./app'),
  config = require('./config'),
  jade = require('jade'),
  React = require('react'),
  request = require('co-request'),
  routerLib = require('./lib/routerLib'),
  tagNames = require('./reactComponents/config.js');

// cashing object with a structure:
// {
//   name: {
//     parametersValue: {
//       value: cash,
//       time: timestamp,
//     }
//   }
// }
const cash = {};

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

    var compileData = {
      data: {
        tagNames: JSON.stringify(tagNames),
      }
    };

    this.body = compile(compileData);
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

    // Cash for 1 hour
    if (cash && cash[ from + '' ] && cash[ from + '' ].time && cash[ from + '' ].time + 60 * 60 * 1000 > Date.now()) {
      return this.body = cash[ from + '' ].value;
    }

    const extractData = yield [
      routerLib.lastStoryId(),
      routerLib.articlesGetter(null, from),
      routerLib.getArticlesNumber()
    ];

    const storyLastId = extractData[0];
    const lastTenStories = extractData[1];
    const storiesMap = extractData[2];

    // const prevLink = from && (from + 10) < storyLastId ?
    //   '/?from=' + (from + 10) :
    //   (from + 10) === storyLastId ? '/' : false;
    // const nextLink = from ?
    //   from > 10 ? '/?from=' + (from - 10) : false :
    //   storyLastId > 10 ? '/?from=' + (storyLastId - 10) : false;

    const reactElement = React.createElement( require('./reactComponents/main.js'), {
      stories: lastTenStories,
      tagNames: tagNames,
      tagNum: storiesMap,
    } );

    const compileDataObj = {
      data: {
        init: JSON.stringify({
          tagNames: tagNames,
          tagNum: storiesMap,
          stories:  lastTenStories,
        }),
        // prevLink: prevLink,
        // nextLink: nextLink,
        html: React.renderToString( reactElement ),
      },
    };

    const compile = jade.compileFile('./server/views/index.jade');
    const result = compile(compileDataObj);

    cash[ from + '' ] = {
      value: result,
      time: Date.now(),
    };

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
