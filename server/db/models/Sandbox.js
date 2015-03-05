module.exports = function createSandboxModel(db) {

  var Sandbox = db.define('sandbox', {
    id: {
      allowNull: false,
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      allowNull: true,
      type: db.Sequelize.STRING,
    },
    header: {
      allowNull: false,
      type: db.Sequelize.STRING,
    },
    text: {
      allowNull: false,
      type: db.Sequelize.TEXT,
    },
    dateTag: {
      type: db.Sequelize.BOOLEAN,
      allowNull: true,
    },
    loveTag: {
      type: db.Sequelize.BOOLEAN,
      allowNull: true,
    },
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });

  Sandbox.sync({force: true}) // TODO: Delete force property when realise app.
    .then(function() {
      // Table created
      Sandbox.create({
        header: 'Первая статья',
        text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
      });

      Sandbox.create({
        header: 'Вторая статья',
        text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
      });
    })
    .catch(function(reason){
      // failure!
      console.log('Sandbox model creation failed! Reason is: ', reason);
    });
}
