'use strict';

const axios = require('axios');

const accessToken = process.env.FB_API_KEY;
const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`;

function post(payload) {

  return axios.post(url, payload)
    .then((response) => response)
    .catch((error) => {
      return error;
    });
}

module.exports = {
  post: post,
}
