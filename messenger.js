'use strict';

var fetcher = require('./fetcher');
var axios = require('./axios');

function reply(entries) {
  console.log('REPLY');
  console.log(entries);
  entries.map((entry) => {
    console.log(entry);
    console.log('hallo A');
    entry.messaging.map((messagingItem) => {
      console.log('hallo B');
      console.log(messagingItem.message);
      
      if (messagingItem.message && messagingItem.message.text) {

        console.log('YOU WROTE THIS:');
        console.log(messagingItem.message.text);
        
        return fetcher('https://www.npr.org/rss/podcast.php?id=510289')
          .then((feed) => {
            const payload = {
              recipient: {
                id: messagingItem.sender.id
              },
              message: {
                text: feed.latestStory().title,
              }
            };
            return axios.post(url, payload)
          });
      } else {
        console.log('no message sent :(');
        return Promise.reject(new Error('No message sent.'))
      }
    });
  });
}

module.exports = reply;
