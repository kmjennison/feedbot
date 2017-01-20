'use strict';

var fetcher = require('./fetcher');
var axios = require('./axios');
var user = require('./user');

const LISTINGS = {
  npr: 'https://www.npr.org/rss/rss.php?id=103537970',
  hn: 'https://news.ycombinator.com/rss',
}

const TOP_LEVEL_FEED_MENU = [
    {
      "content_type":"text",
      "title":"NPR",
      "payload":"npr"
    },
    {
      "content_type":"text",
      "title":"Hacker News",
      "payload":"hn"
    },
];

const IN_FEED_MENU = [
  {
    "content_type":"text",
    "title":"More?",
    "payload":"more"
  },
  {
    "content_type":"text",
    "title":"Something else?",
    "payload":"se"
  },
];

function replyToText(messagingItem, continuing) {
  const feed_location = LISTINGS[messagingItem.message.text.toLowerCase()];
  if (!feed_location && !continuing) {
    const payload = {
      recipient: {
        id: messagingItem.sender.id
      },
      message: {
        text: `Sorry "${messagingItem.message.text}" is not a supported feed. What about one of these?`,
        "quick_replies": TOP_LEVEL_FEED_MENU,
      },
    };
    return axios.post(payload);
  }
  return fetcher(feed_location)
    .then((feed) => {
      const story = feed.latestStory();
      const payload = {
        recipient: {
          id: messagingItem.sender.id
        },
        message: {
          text: story.title + ': ' + story.link,
          "quick_replies": IN_FEED_MENU,
        }
      };
      return axios.post(payload);
    });
}

function sayHiAndMenu(messagingItem) {
  console.log("Saying hi to " + messagingItem.sender.id);
  return axios.getUser(messagingItem.sender.id)
    .then(response => {
      console.log("Got user profile ", response.data);
      const payload = {
        recipient: {
          id: messagingItem.sender.id
        },
        message: {
          text: `Hello ${response.data.first_name}! Want to read something?`,
          "quick_replies": TOP_LEVEL_FEED_MENU,
        },
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

      console.log('Looking up the user...');
      user.get(messagingItem.sender.id, (user) => {
        console.log('Great! We have a user:');
        console.log(user);
      });

      if (messagingItem.message) {
        if (messagingItem.message.text) {
          if (messagingItem.message.text == "more") {
            return replyToText(messagingItem, true);
          } else if (messagingItem.message.text == "se") {
            const payload = {
              recipient: {
                id: messagingItem.sender.id
              },
              message: {
                text: `What would you like to read?`,
                "quick_replies": TOP_LEVEL_FEED_MENU,
              },
            };
            return axios.post(payload);
          } else {
            return replyToText(messagingItem);
          }
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
