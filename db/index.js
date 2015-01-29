const config = require('./config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,

  pool: {
    maxConnections: 50,
    minConnections: 0,
    maxIdleTime: 10000
  },

});

var User = sequelize.define('article', {
  id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  header: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: false,
  },
  text: {
    allowNull: false,
    type: Sequelize.TEXT,
  },
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync({force: true}) // TODO: Delete force property when realise app.
  .then(function () {
    // Table created
    return User.create({
      header: 'Trulala',
      text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.'
    });
  })
  .catch(function(reason){
    // failure!
    console.log('Model creation failed! Reason is: ', reason);
  });
