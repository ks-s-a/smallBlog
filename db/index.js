const Sequelize = require('sequelize');

const sequelize = new Sequelize('neo', 'neo', '', {
  dialect: 'postgres',

  pool: {
    maxConnections: 50,
    minConnections: 0,
    maxIdleTime: 10000
  },

});

var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
}).catch(function(reason){
  // failure!
  console.log('reason is: ', reason);
});;
