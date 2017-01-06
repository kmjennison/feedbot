'use strict';

const axios = require('axios');

function post(payload) {
  const accessToken = process.env.FB_API_KEY;
  const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`;

  console.log(payload);

  return axios.post(url, payload)
    .then((response) => resolve(response))
    .catch((error) => reject(error));
}

module.exports = {
  post: post,
}
