'use strict';

const axios = require('axios');

const accessToken = process.env.FB_API_KEY;
const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`;

function post(payload) {

  return axios.post(url, payload)
    .then((response) => response)
    .catch((error) => error);
}

function getUser(userId) {
  // From https://developers.facebook.com/docs/messenger-platform/user-profile
  const userUrl = `https://graph.facebook.com/v2.6/${userId}?access_token=${accessToken}`;
  return axios.get(userUrl)
    .then((response) => response)
    .catch((error) => error);
}

module.exports = {
  post: post,
  getUser: getUser,
}
