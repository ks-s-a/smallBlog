var match = process.env.DATABASE_URL.match(/^postgres:\/\/([^:]+):([^@]+)@([^:]+):([^\/]+)\/(.+)$/);

console.log('process.env.NODE_ENV is: ', process.env.NODE_ENV);

module.exports = process.env.NODE_ENV === 'production' ?
  {
    isProduction: true,
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: true,
    dialectOptions: {
      native: true
    },
  } :
  {
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
  }
