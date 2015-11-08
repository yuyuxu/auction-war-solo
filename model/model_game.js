var Socket = require('./model_socket');
var Utility = require('../utility/utility');
var ManagerUser = require('../model/model_manager_user').GetInstance();
var LoggerModel = require('../utility/logger').GetLogger('model');
var ManagerDB = require('../data_access/aws_dynamodb');

/**
 * Game model class
 * @param {string} game_id - The input game id.
 */
function Game (game_id, array_user_ids) {
	this.game_id = game_id;
	this.users = array_user_ids;
	this.starting_player = -1;
	this.users_status = [];
	this.same_status = '';
	this.game_history = [];
}

Game.prototype.Init = function () {
	for (var i = 0; i < this.users.length; i++)	
		this.users_status.push('');
}

Game.prototype.GetOtherUserId = function (user_id) {
	for (var i = 0; i < this.users.length; i++) {
		if (this.users[i] != user_id) {
			return this.users[i];
		}
	}
	return '';
}

Game.prototype.SetStatus = function (user_id, status) {
	var same = status;
	for (var i = 0; i < this.users.length; i++) {
		if (this.users[i] == user_id) {
			this.users_status[i] = status;
		}
		else if (this.users_status[i] != status) {
			same = '';
		}
	}
	if (same != '')	this.same_status = same;
	else			this.same_status = '';
	LoggerModel.info([this.users, this.users_status, user_id, status, this.same_status], 'SetStatus');
	return this.same_status;
}

Game.prototype.GetSameStatus = function (status) {
	return this.same_status;
}

Game.prototype.SetSameStatus = function (status) {
	for (var i = 0; i < this.users_status.length; i++) {
		this.users_status[i] = status;
	}
}

Game.prototype.PruneSockets = function (socket_map) {
	for (var i = 0; i < this.users.length; i++) {
		if (socket_map[this.users[i]] != null) {
			socket_map[this.users[i]].join(this.game_id);
			delete socket_map[this.users[i]];
		}
	}
}

Game.prototype.Load = function () {
	LoggerModel.info(this.users, 'Load Game ');
	for (var i = 0; i < this.users.length; i++) {
		var user = ManagerUser.GetUser(this.users[i]);
		params = {
			player_id : user.user_id,
			player_game_name : user.GetGameName(),
		};
		Socket.Speak('from-server:load-game', this.game_id, params);
	}
}

Game.prototype.Start = function () {
	LoggerModel.info(this.users, 'Start Game ');
	for (var i = 0; i < this.users.length; i++) {
		var user = ManagerUser.GetUser(this.users[i]);
		if (user.GetGameName() == 'Sam')	{
			this.starting_player = i;
			params = {
				player_id : user.user_id,
				player_game_name : user.GetGameName(),
			};
			Socket.Speak('from-server:start-game', this.game_id, params);
			return;
		}
	}
}

Game.prototype.Submit = function (data) {
	var next_user_id = this.GetOtherUserId(data['player_id']);
	if (next_user_id == '')	LoggerModel.error('Game submit err: next_user_id %s is not valid. ' + next_user_id);

	data['time'] = Utility.GetTimeHMS();
	this.game_history.push(JSON.stringify(data));

	var action = data['action_type'];
	if (action == 'accept') {
		LoggerModel.info('Set game status to accept. ' + data['player_id']);		
		this.SetStatus(data['player_id'], 'accept');
	}
	else {
		this.SetStatus(data['player_id'], 'game');
	}
	
	if (this.GetSameStatus() == 'accept') {
		var this_game = this;
		var user_ids = this.users;
		var game_history_str = this.game_history.toString();
		var game_id = this.game_id;

		ManagerDB.CreateGame(game_id, user_ids.toString(), function (err, data) {
			if (err) {
				LoggerModel.error(err, 'UpdateAttributeGameActions error ');
			}
			else {
				for (var i = 0; i < user_ids.length; i++) {
					ManagerDB.UpdateAttributeGame(user_ids[i], game_id);
				}
				ManagerDB.UpdateAttributeGameActions(game_id, game_history_str);
				this_game.SetSameStatus('finishedgame');
				Socket.Speak('from-server:finish-game', game_id, {});
			}
		});
	}
	else {	
		params = {
			player_id : next_user_id,
			action_type: data['action_type'],
			action_params : data['action_params']
		};
		Socket.Speak('from-server:next-turn', this.game_id, params);
	}
}

Game.prototype.Disconnect = function () {
	for (var i = 0; i < this.users.length; i++) {
		var user = ManagerUser.GetUser(this.users[i]);
		params = {
			player_id : user.user_id,
		};
		Socket.Speak('from-server:dc', this.game_id, params);
	}
}

module.exports = Game;