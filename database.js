'use strict';

var AWS = require('aws-sdk');
var dynamoDb = new AWS.DynamoDB.DocumentClient();

var database = {};

database.updateItem = function(params, callback) {
  dynamoDb.putItem(params, callback);
};

database.getItem = function(params, callback) {
  dynamoDb.getItem(params, callback);
};

module.exports = database;
