var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

module.exports = {
  database: match[5],
  username: match[1],
  password: match[2],
  dialect: 'postgres',
  protocol: 'postgres',
  port: match[4],
  host: match[3],
  logging: true,
  dialectOptions: {
    native: true
  },
}
