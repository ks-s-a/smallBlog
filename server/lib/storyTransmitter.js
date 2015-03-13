const db = require('../db');

module.exports = function () {

  db.Sandbox.find({
    where: {
      status: 'approved'
    },
  })
    .then(function(articleToTransmit) {
      if (!articleToTransmit)
        throw 'Has not article for transmiting!';

      // Remove article from sandbox
      db.Sandbox.destroy({
        where: {
          id: articleToTransmit.id,
        }
      });

      var data = articleToTransmit.dataValues;

      // Delete unnecessary properties
      delete data['id'];
      delete data['status'];
      delete data['createdAt'];
      delete data['updatedAt'];

      // Put article in main table
      return db.Article.create(data);
    })
    .catch(function(err) {
      console.log('error when transmiting : ', err);
    });
};
