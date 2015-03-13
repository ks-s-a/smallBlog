const app = require('./server/router'),
  config = require('./server/config');

app.listen(config.port);
