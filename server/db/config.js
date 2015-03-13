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
}

else if (process.env.NODE_ENV === 'development') {
  module.exports = {
    isProduction: false,

    dialect: 'postgres',
    protocol: 'postgres',

    database: 'neo',
    port: 5432,
    host: 'localhost',
    username: 'neo',
    password: '',

    logging: true,
    dialectOptions: {
      native: true
    },
  };
}

else {
  module.exports = {
    isProduction: false,

    dialect: 'postgres',
    protocol: 'postgres',

    database: 'neo',
    port: 5432,
    host: 'localhost',
    username: 'neo',
    password: '',

    logging: true,
    dialectOptions: {
      native: true
    },
  };
}
