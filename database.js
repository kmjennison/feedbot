'use strict';

var AWS = require('aws-sdk');
var db = new AWS.DynamoDB.DocumentClient();

var exports = {};

exports.updateItem = function(params, callback) {
  dynamoDb.putItem(params, callback);
};

exports.getItem = function(params, callback) {
  dynamoDb.getItem(params, callback);
};

module.exports = exports;
