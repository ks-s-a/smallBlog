const app = require('./server/router'),
  config = require('./server/config');

console.log('port is: ', config.port);

app.listen(config.port);
