var utilities = require('./library/utilities.js');
var inquirer = require('inquirer');
var reddit = require('./library/reddit.js');
var imageToAscii = require('image-to-ascii');
var clear = require('cli-clear');

var menuChoices = [
  {name: 'Show homepage', value: 'HOMEPAGE'},
  {name: 'Show subreddit', value: 'SUBREDDIT'},
  {name: 'List subreddits', value: 'SUBREDDITS'}
];


function redditMenu() {
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What do you want to do?',
    choices: menuChoices
  }).then(
    function(answers) {
      if (answers.menu === "HOMEPAGE") {
        reddit.getHomepage(function(err, homePagePosts) {
          if (err) {
            console.log('Something went wrong.');
          }
          else {
            utilities.oLog(homePagePosts);
          }
        });
      }
      else if(answers.menu === "SUBREDDIT") {
        inquirer.prompt({
          type: 'input',
          name: 'menu',
          message: 'Which subreddit would you like to see?'
        }).then(function(answers) {
          reddit.getSubreddit(answers.menu, function(err, subreddit) {
            utilities.oLog(subreddit);
          });
        });
      }
      else if(answers.menu === "SUBREDDITS") {
        reddit.getSubreddits(function(err, subreddits) {
          var listSubreddits = subreddits.map(function(subreddit) {
            return subreddit.data.url.substring(3);
          });
          listSubreddits.push(new inquirer.Separator());
          listSubreddits.push({name:'Go back to the main menu.', value:'go_back_to_main_menu'});
          inquirer.prompt({
            type: 'list',
            name: 'menu',
            message: 'Which subreddit would you like to see?',
            choices: listSubreddits
          })
          .then(function(subreddit) {
            if (subreddit.menu === "go_back_to_main_menu") {
              redditMenu();
            }
            else {
              reddit.getSubreddit(subreddit.menu, function(err, subreddit) {
                var postData = subreddit.map(function(post) {
                  return {
                    name: post.data.title,
                    value: post.data
                  };
                });
                inquirer.prompt(
                  {
                  type:'list',
                  name:'menu',
                  message: 'Which post would you like to see?',
                  choices: postData
                }).then(function(answer) {
                  utilities.oLog(answer);
                });
              });
            }
          });
        });
      }
    }
  ).catch(function(e) {
    console.log(e);
  });
}

redditMenu();
