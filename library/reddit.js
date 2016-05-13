var request = require('request');
var utilities = require('./utilities.js');

/*
This function should "return" the default homepage posts as an array of objects
*/
function getHomepage(callback) {
  // Load reddit.com/.json and call back with the array of posts
  request('http://www.reddit.com/.json', function(err, homePageData) {
    callback(null, JSON.parse(homePageData.body).data.children);
  });
}

/*
This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedHomepage(sortingMethod, callback) {
  // Load reddit.com/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  request('http://www.reddit.com/'+sortingMethod+'.json',function(err, sortedPageData) {
    if (err) {
      callback(err);
    }
    else {
      try {
        var parsedResult = JSON.parse(sortedPageData.body);
      }
      catch(e) {
        callback(e);
        return;
      }
      if (parsedResult.error) {
        callback(new Error('Something went wrong.'));
      }
      else {
        callback(null,parsedResult.data.children)
      }
    }
  });
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/
function getSubreddit(subreddit, callback) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts.
  request('http://www.reddit.com/r/'+subreddit+'.json', function(err, subredditData) {
    if (err) {
      callback(err);
    }
    else {
      try {
        var parsedResult = JSON.parse(subredditData.body);
      }
      catch(e) {
        callback(e);
        return;
      }
      if (parsedResult.error) {
        callback(new Error('Something went wrong.'));
      }
      else {
        callback(null, parsedResult.data.children)
      }
    }
  });
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedSubreddit(subreddit, sortingMethod, callback) {
  // Load reddit.com/r/{subreddit}/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  request('http://www.reddit.com/r/'+subreddit+'/'+sortingMethod+'.json', function(err, sortedSubredditData) {
    var sortingMethods = ['controversial','hot','bad'];
    if (sortingMethods.indexOf(sortingMethod) == -1) {
      callback(new Error('Invalid sorting method.'));
    }
    else {
      callback(null,JSON.parse(sortedSubredditData.body).data.children);
    }
  });
}

/*
This function should "return" all the popular subreddits
*/
function getSubreddits(callback) {
  // Load reddit.com/subreddits.json and call back with an array of subreddits.
  request('http://www.reddit.com/subreddits.json', function(err, subreddits) {
    if (err) {
      callback(err);
    }
    else {
      try {
        var parsedResult = JSON.parse(subreddits.body);
      }
      catch(e) {
        callback(e);
        return;
      }
      if (parsedResult.error) {
        callback(new Error('Something went wrong.'));
      }
      else {
        callback(null,parsedResult.data.children);
      }
    }
  });
}

// Export the API
module.exports = {
  getHomepage: getHomepage,
  getSortedHomepage: getSortedHomepage,
  getSubreddit: getSubreddit,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddits: getSubreddits
};
