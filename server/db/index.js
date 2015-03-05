const config = require('./config');
const Sequelize = require('sequelize');

var standartDBSettings = {
  dialect: config.dialect,
  protocol: config.protocol,

  pool: {
    maxConnections: 50,
    minConnections: 0,
    maxIdleTime: 10000
  },

  logging: config.logging,
  dialectOptions: config.dialectOptions,
};

var db = config.isProduction ?
  new Sequelize(process.env.DATABASE_URL,standartDBSettings) :
  new Sequelize(config.database , config.username, config.password, standartDBSettings);

// Init tables it not yet...
if (!db.models.article) {
  require('./models/Article')(db);
}

if (!db.models.sandbox) {
  require('./models/Sandbox')(db);
}

db.Article = db.models.article;
db.Sandbox = db.models.sandbox;
db.Sequelize = Sequelize;

module.exports = db;
