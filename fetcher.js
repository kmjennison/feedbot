'use strict';

var feedparser = require('feedparser-promised');


class Story {
  constructor(feedparserObj) {
    this.title = feedparserObj['title'];
    this.author = feedparserObj['author'];
    this.link = feedparserObj['link'] ? feedparserObj['link'] : feedparserObj['meta']['link'];
    this.date = feedparserObj['pubdate'];
    this.image = feedparserObj['image']; // object with `url` and `title` properties
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
  return feedparser.parse(feedUrl)
    .then((items) => {
      return new Feed(feedUrl, items)
    })
    .catch((error) => error);
}

module.exports = fetch;
