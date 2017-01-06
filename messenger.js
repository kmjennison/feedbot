'use strict';

var fetcher = require('./fetcher');
var axios = require('./axios');

function reply(entries) {

  // `entries` can contain batches of messages from different users.
  return Promise.all(entries.map((entry) => {
    return Promise.all(entry.messaging.map((messagingItem) => {
      if (messagingItem.message && messagingItem.message.text) {

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
            return axios.post(payload)
          });
      } else {
        return Promise.reject('No message sent.');
      }
    }));
  }));
}

module.exports = reply;
