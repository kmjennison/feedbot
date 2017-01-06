'use strict';

var messenger = require('./messenger');

module.exports.webhook = (event, context, callback) => {
  if (event.method === 'GET') {
    // Facebook app verification
    const challengeToken = process.env.CHALLENGE_TOKEN;
    if (event.query['hub.verify_token'] == challengeToken && event.query['hub.challenge']) {
      callback(null, parseInt(event.query['hub.challenge']));
    }
    callback('Invalid token');
  }

  console.log('here');

  if (event.method === 'POST') {
    console.log('posting');
    messenger(event.body.entry)
      .then((response) => callback(null, response))
      .catch((response) => callback('Wrong!', response));
  }
};
