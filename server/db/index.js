const config = require('./config');
const Sequelize = require('sequelize');

var standartDBSettings = {
  dialect: config.dialect,
  protocol: config.protocol,

  pool: {
    maxIdleTime: 10000
  },

  logging: config.logging,
  dialectOptions: config.dialectOptions,
};

var db = config.isProduction ?
  new Sequelize(process.env.DATABASE_URL, standartDBSettings) :
  new Sequelize(
    config.database,
    config.username,
    config.password,
    standartDBSettings);

db.isProduction = config.isProduction;

// Init tables...
require('./models/Article')(db);
require('./models/Sandbox')(db);

db.Article = db.models.article;
db.Sandbox = db.models.sandbox;
db.Sequelize = Sequelize;

module.exports = db;
