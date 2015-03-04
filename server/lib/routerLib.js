const db = require('../db'),
  tagMap = require('../db/tagMap'),
  commonLib = require('./common');


//--------------Sandbox----------------------------//
function* addArticleToSandbox(title, text, tags) {
  yield db.Sandbox.create({
    header: title.toString(),
    text: text.toString(),
  });
}

function* approveSandboxArticle(storyId, header, text, tagsArr) {
  var tagFields = tagsArr.reduce(function(p,c) {
    if (tagMap[c]) {
      p[tagMap[c]] = true;
    }

    return p;
  }, {});

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
    }})
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

module.exports.addArticleToSandbox = addArticleToSandbox;
module.exports.approveSandboxArticle = approveSandboxArticle;
module.exports.removeArticleFromSandbox = removeArticleFromSandbox;

module.exports.getArticlesForModeration = getArticlesForModeration;
module.exports.articlesGetter = articlesGetter;
module.exports.getArticlesNumber = getArticlesNumber;
