const db = require('../db'),
  commonLib = require('./common'),
  pagesSettings = require('./../config/pagesSettings'),
  tagMap = require('../db/tagMap'),
  update = require('./../../node_modules/react/lib/update'),
  React = require('react');


//--------------Sandbox----------------------------//
function* addArticleToSandbox(title, text, tags) {
  yield db.Sandbox.create({
    header: title.toString(),
    text: text.toString(),
  });
}

function* approveSandboxArticle(storyId, header, text, tagsObj) {
  var tagFields = {};

  for (var i in tagsObj) {
    if (!tagMap[i]) throw 'Unknown tag name!';

    tagFields[ tagMap[i] ] = tagsObj[i];
  };

  var valueObj = commonLib.margeObjects(tagFields, {
    id: storyId,
    header: header,
    text: text,
    status: 'approved',
  });

  yield db.Sandbox.upsert(valueObj);
}

function* removeArticleFromSandbox(storyId) {
  yield db.Sandbox.destroy({
    where: {
      id: storyId,
    },
  });
}
//-------------------------------------------------//

//----------------Moderation-----------------------//
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
//-------------------------------------------------//

//----------------Main-page------------------------//
function* lastStoryId() {
  return yield db.Article.max('id');
}

function* articlesGetter(tags, lastStoryId) {
  var lastStoryObj = lastStoryId ? {
    id: {
      $lt: +lastStoryId,
    },
  } : {};

  var tagObjectForQuery = commonLib.margeObjects( commonLib.translateTagsToQueryObj(tags), lastStoryObj );

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
      }
    });
  });
}

function* getArticlesNumber(tags) {
  // convert entery array
  var tagObjectForQuery = (tags && tags.length) ? commonLib.translateTagsToQueryObj(tags) : null;

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

function* getPageContent(pagePath) {
  const lastTenStories = yield articlesGetter(null);
  const propsData = {
    stories: lastTenStories,
    storiesTheme: null,
  };
  const reactElement = React.createElement( require('./../reactComponents/main.js'), propsData );
  const compileDataObj = {
    data: update({
      html: React.renderToString( reactElement ),
      init: JSON.stringify(propsData),
    }, {$merge: pagesSettings.main}),
  };

  return compileDataObj;
}
//-------------------------------------------------//

module.exports.addArticleToSandbox = addArticleToSandbox;
module.exports.approveSandboxArticle = approveSandboxArticle;
module.exports.removeArticleFromSandbox = removeArticleFromSandbox;

module.exports.articlesGetter = articlesGetter;
module.exports.getArticlesForModeration = getArticlesForModeration;
module.exports.getPageContent = getPageContent;
module.exports.getArticlesNumber = getArticlesNumber;
module.exports.lastStoryId = lastStoryId;
