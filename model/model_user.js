var manager_db = require('../data_access/aws_dynamodb');
var logger = require('../utility/logger');
var timer = require('../utility/timer');
var fs = require('fs');
var path = require('path');

/**
 * User model
 */
function User (user_id) {
  this.user_id = user_id;

  // cached data for each page
  this.cache = {
    questionnaire: '*',
    role: '*',
    quiz: '*',
    game: '*',
    reward: '*',
  };

  // user behavior logged from server side
  this.log_behaviors = [];
  this.log_started = false;
}

User.prototype.LoadData = function (data) {
  this.cache['questionnaire'] = data['Item']['questionnaire']['S'];
  this.cache['role'] = data['Item']['role']['S'];
  this.cache['quiz'] = data['Item']['quiz']['S'];
  this.cache['game'] = data['Item']['game']['S'];
  this.cache['reward'] = data['Item']['reward']['S'];
}

User.prototype.SetData = function (attribute, data) {
  if (attribute == 'questionnaire') {
    this.cache['questionnaire'] = data;
  }
  else if (attribute == 'role') {
    this.cache['role'] = data;
  }
  else if (attribute == 'quiz') {
    this.cache['quiz'] = data;
  }
  else if (attribute == 'game') {
    this.cache['game'] = data;
  }
  else if (attribute == 'reward') {
    this.cache['reward'] == data;
  }
}

User.prototype.GetData = function (attribute) {
  if (attribute == 'questionnaire') {
    return this.cache['questionnaire'];
  }
  else if (attribute == 'role') {
    return this.cache['role'];
  }
  else if (attribute == 'quiz') {
    return this.cache['quiz'];
  }
  else if (attribute == 'game') {
    return this.cache['game'];
  }
  else if (attribute == 'reward') {
    return this.cache['reward'];
  }
  return null;
}

User.prototype.GetGameName = function () {
  return this.cache['role'];
}

User.prototype.FinishedGame = function () {
  if (this.cache.reward === '' || this.cache.reward === '*') {
    return false;
  } else {
    logger.Log('Game finished. User ' + this.user_id +
             ' is getting reward: ' + this.cache.reward);
    return true;
  }
}

User.prototype.Log = function (type, data) {
  data['type'] = type;
  data['time'] = timer.GetTimeHMS();
  data_str = JSON.stringify(data);
  data_str += '\n';

  var log_file = '../bin/logs/' + this.user_id + '_server.json';
  fs.exists(log_file, function (exists) {
    if (!exists) {
      fs.writeFile(log_file, data_str, function (err) {
        if (err) {
          logger.Log(err);
        }
      });
    } else {
      fs.appendFile(log_file, data_str, function (err) {
        if (err) {
          logger.Log(err);
        }
      });
    }
  });
}

module.exports = User;