console.log('process.env.DATABASE_URL is: ', process.env.DATABASE_URL);
var match = process.env.DATABASE_URL.match(/^postgres:\/\/([^:]+):([^@]+)@([^:]+):([^\/]+)\/(.+)$/);

console.log('match is: ', match[0], match[1], match[2], match[3], match[4], match[5]);
module.exports = {
  database: match[0],
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
