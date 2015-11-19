var fs = require('fs');
var path = require('path');
var logger = require('../utility/logger');

/** Model (object) for user.
 * @param {string} user_id - id of the user
 */
function User(user_id) {
  /** User id. */
  this.user_id = user_id;

  /** User model data cache.
   * @type {Object.<string, string>}
   */
  this.cache = {
    questionnaire: '*',
    role: '*',
    quiz: '*',
    game: '*',
    reward: '*',
  };
}

/** Set data cache.
 * @param {string} attribute - attribute name.
 * @param {string} value - attribute value.
 */
User.prototype.SetData = function(attribute, value) {
  if (attribute == 'questionnaire') {
    this.cache['questionnaire'] = value;
  }
  else if (attribute == 'role') {
    this.cache['role'] = value;
  }
  else if (attribute == 'quiz') {
    this.cache['quiz'] = value;
  }
  else if (attribute == 'game') {
    this.cache['game'] = value;
  }
  else if (attribute == 'reward') {
    this.cache['reward'] == value;
  }
}

/** Get data cache.
 * @param {string} attribute - attribute name.
 */
User.prototype.GetData = function(attribute) {
  if (attribute == 'questionnaire') {
    return this.cache['questionnaire'];
  } else if (attribute == 'role') {
    return this.cache['role'];
  } else if (attribute == 'quiz') {
    return this.cache['quiz'];
  } else if (attribute == 'game') {
    return this.cache['game'];
  } else if (attribute == 'reward') {
    return this.cache['reward'];
  } else {
    logger.Log('User GetData Error: attribute not found ' + attribute);
    return null;
  }
}

/** Get user game name. */
User.prototype.GetGameName = function() {
  return this.cache['role'];
}

/** Check whether user has finished game. */
User.prototype.FinishedGame = function() {
  if (this.cache.reward === '' || this.cache.reward === '*') {
    return false;
  } else {
    logger.Log('Game finished. User ' + this.user_id +
               ' is getting reward: ' + this.cache.reward);
    return true;
  }
}

module.exports = User;
