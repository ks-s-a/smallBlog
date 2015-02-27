const tagMap = require('../db/tagMap');

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

module.exports.translateTagsToQueryObj = translateTagsToQueryObj;
module.exports.margeObjects = margeObjects;
