'use strict';

var fetcher = require('./fetcher');
var axios = require('./axios');

function replyToText(messagingItem) {
  // TODO: call RSS feed based on user input
  return fetcher('https://www.npr.org/rss/rss.php?id=103537970')
    .then((feed) => {
      const story = feed.latestStory();
      const payload = {
        recipient: {
          id: messagingItem.sender.id
        },
        message: {
          text: story.title + ': ' + story.link,
        }
      };
      return axios.post(payload);
    });
}

function sayHiAndMenu(messagingItem) {
  console.log("Saying hi to " + messagingItem.sender.id);
  return axios.getUser(messagingItem.sender.id)
    .then(user => {
      const payload = {
        recipient: {
          id: messagingItem.sender.id
        },
        message: {
          text: `Hello ${user.first_name}!`,
        }
      };
      return axios.post(payload);
    })
    .catch(error => {
      console.log("Could not retrieve user for id " + messagingItem.sender.id);
    });
}

function reply(entries) {
  // `entries` can contain batches of messages from different users.
  return Promise.all(entries.map((entry) => {
    return Promise.all(entry.messaging.map((messagingItem) => {

      console.log('Sender id is:');
      console.log(messagingItem.sender.id);

      if (messagingItem.message) {
        if (messagingItem.text) {
          return replyToText(messagingItem);
        } else {
          return sayHiAndMenu(messagingItem);
        }
      } else {
        return Promise.reject('No message sent.');
      }
    }));
  }));
}

module.exports = reply;
