'use strict';

var db = require('./database');


function create(userId, callback) {

  console.log('Creating a new user with ID ' + userId);

  var user = {
    'id': userId
  };

  var params = {
    TableName: 'usersTable',
    Item: user,
  };

  db.put(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log('Successful user creation!', data);
    }
  });

  callback(user);
};

// Gets or creates a user.
function get(userId, callback) {

  console.log('Getting user with user ID ' + userId);

  var params = {
    AttributesToGet: [
      'id'
    ],
    TableName : 'usersTable',
    Key: { 
      'id': userId,
    }
  };

  db.get(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {

      // Item does not exist, so let's create a new user.
      if (!data) {
        create(userId, callback);
      } else {
        console.log('Found the user:', data);
        callback(data);
      }      
    }
  });
  
}

module.exports = {
  create: create,
  get: get
};
