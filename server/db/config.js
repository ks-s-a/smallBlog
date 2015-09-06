if (process.env.NODE_ENV === 'production') {
  var match = process.env.DATABASE_URL.match(/^postgres:\/\/([^:]+):([^@]+)@([^:]+):([^\/]+)\/(.+)$/);

  module.exports = {
    isProduction: true,
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: false,
    dialectOptions: {
      native: true
    },
  };
} else {
  module.exports = {
    isProduction: false,

    dialect: 'postgres',
    protocol: 'postgres',

    database: 'sandbox',
    port: 5432,
    host: 'localhost',
    username: 's.ksenofontov',
    password: '',

    logging: false,
    dialectOptions: {
      native: true
    },
  };
}
