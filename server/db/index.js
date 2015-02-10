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

var db = {};

db.sequelize = sequelize;

var Article = sequelize.define('article', {
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
  dateTag: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  loveTag: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Article.sync({force: true}) // TODO: Delete force property when realise app.
  .then(function () {
    // Table created
    Article.create({
      header: 'Trulala',
      text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
      dateTag: true,
      loveTag: false,
    });

    Article.create({
      header: 'Tratata',
      text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
      dateTag: true,
      loveTag: true,
    });

    Article.create({
      header: 'Proror',
      text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
      dateTag: false,
      loveTag: true,
    });

    Article.create({
      header: 'Lololo',
      text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
      dateTag: false,
      loveTag: true,
    });

    Article.create({
      header: 'Trulala',
      text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
      dateTag: false,
      loveTag: true,
    });

    Article.create({
      header: 'Tratata',
      text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
      dateTag: false,
      loveTag: true,
    });

    Article.create({
      header: 'Proror',
      text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
      dateTag: false,
      loveTag: true,
    });

    Article.create({
      header: 'Lololo',
      text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
      dateTag: true,
      loveTag: true,
    });
  })
  .catch(function(reason){
    // failure!
    console.log('Model creation failed! Reason is: ', reason);
  });

db.Article = Article;

module.exports = db;