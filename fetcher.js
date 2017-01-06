'use strict';

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed
var toArray = require('stream-to-array')


class Story {
  constructor(feedparserObj) {
    this.title = feedparserObj['title'];
    this.author = feedparserObj['author'];
    this.link = feedparserObj['link'] ? feedparserObj['link'] : feedparserObj['meta']['link'];
    this.date = feedparserObj['pubdate'];
    this.img = feedparserObj['image'];
  }
}


class Feed {
  constructor(feedUrl, feed) {
    this.url = feedUrl;
    this.feed = feed;
  }

  latestStory() {
    return new Story(this.feed[0]);
  }
}


function fetch(feedUrl) {
  var req = request(feedUrl);
  var feedparser = new FeedParser();

  return new Promise(function(resolve, reject){

    req.on('error', function (error) {
      reject(error);
    });

    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream

      if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'));
      }
      else {
        stream.pipe(feedparser);
      }
    });

    feedparser.on('error', function (error) {
      reject(error);
    });

    feedparser.on('readable', function () {
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta;
      var item;

      // Convert the stream to an array.
      toArray(stream)
        .then((feedList) => resolve(new Feed(feedUrl, feedList)))
        .catch((error) => reject(error));
    });
  });
}

module.exports = fetch;
