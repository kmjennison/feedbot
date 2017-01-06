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

  if (event.method === 'POST') {
    callback(null);

    messenger(event.body.entry)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }
};
