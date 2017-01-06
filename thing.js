
var fetcher = require('./fetcher');

fetcher('https://www.npr.org/rss/podcast.php?id=510289')
  .then(function(feed) {
    console.log(feed.latestStory());
  });
