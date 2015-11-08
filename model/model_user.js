var manager_db = require('../data_access/aws_dynamodb');
var logger_model = require('../utility/logger').GetLogger('model');
var Utility = require('../utility/utility');
var fs = require('fs');
var path = require('path');

/**
 * User model class 
 * @param {string} user_id - The input user id.
 * Note about user specific information:
 * 	time, type, data
 *		type: controller, socket, game
 */
function User (user_id) {
	this.user_id = user_id;
	this.cached_data = {
		ques: '*',
		role: '*',
		quiz: '*',
		game: '*',
		reward: '*',
	};
	this.activity_history = [];
	this.log_started = false;
}

User.prototype.LoadData = function (data) {
	this.cached_data['ques'] = manager_db.GetPlayerAttribute('questionnaire', data);
	this.cached_data['reward'] = manager_db.GetPlayerAttribute('reward', data);
	this.cached_data['quiz'] = manager_db.GetPlayerAttribute('quiz', data);
	manager_db.UpdateAttributeRole(this.user_id, '*');
	manager_db.UpdateAttributeGame(this.user_id, '*');
}


User.prototype.SetData = function (attribute, data) {
	if (attribute == 'questionnaire') {
		this.cached_data['ques'] = data;
	}
	else if (attribute == 'role') {
		this.cached_data['role'] = data;
	}
	else if (attribute == 'quiz') {
		this.cached_data['quiz'] = data;
	}
	else if (attribute == 'game') {
		this.cached_data['game'] = data;
	}
	else if (attribute == 'reward') {
		this.cached_data['reward'] == data;
	}
}

User.prototype.GetData = function (attribute) {
	if (attribute == 'questionnaire') {
		return this.cached_data['ques'];
	}
	else if (attribute == 'role') {
		return this.cached_data['role'];
	}
	else if (attribute == 'quiz') {
		return this.cached_data['quiz'];
	}
	else if (attribute == 'game') {
		return this.cached_data['game'];
	}
	else if (attribute == 'reward') {
		return this.cached_data['reward'];
	}
	return null;
}

User.prototype.GetGameName = function () {
	var role = this.cached_data['role'];
	var tokens = role.split('-');
	if (tokens.length != 2)	logger_model.error('GetGameName ERR: user role %s is not valid.', role);
	return tokens[0];
}

User.prototype.FinishedGame = function () {
	// Debug
	// return false;
	logger_model.info(this.cached_data.reward, 'FinishedGame ');
	if (this.cached_data.reward == '' || this.cached_data.reward == '*') {
		return false;
	}
	return true;
}

User.prototype.Log = function (data) {
	data['time'] = Utility.GetTimeHMS();
	data_str = JSON.stringify(data);
	data_str += '\n';

	var game_data_file = path.join(__dirname, '../bin/player_actions_log/' + this.user_id + '.json');
	if (!this.log_started) {
		this.log_started = true;
		fs.writeFile(game_data_file, data_str, function (err) {
			if (err) {
				logger_model.error(err);
			}
		});
	}
	else {
		fs.appendFile(game_data_file, data_str, function (err) {
			if (err) {
				logger_model.error(err);
			}
		});	
	}
}

User.prototype.SaveLog = function () {
	var game_data_file = path.join(__dirname, '../bin/player_actions_log/' + this.user_id + '.json');
	var data = this.activity_history.toString();
	fs.writeFile(game_data_file, data, function (err) {
		if (err) {
			logger_model.error(err);
		}
	});
}

module.exports = User;