'use strict';

var AWS = require('aws-sdk');
var dynamoDb = new AWS.DynamoDB.DocumentClient();

var database = {};

database.put = function(params, callback) {
  dynamoDb.put(params, callback);
};

database.get = function(params, callback) {
  dynamoDb.get(params, callback);
};

module.exports = database;
