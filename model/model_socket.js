var socket_io = require('socket.io');
var io = null;

var manager_db = require('../data_access/aws_dynamodb');
var manager_game = require('../model/model_manager_game').GetInstance();
var manager_user = require('../model/model_manager_user').GetInstance();

var logger_model = require('../utility/logger').GetLogger('model');

/**
 * This model deals with interface that receives message from client.
 * 
 * Some notes on the messages style:
 *	Message: use '-', ':'
 *	Possible receiving messages: disconnection, from-server:dc, from-server:load-game, from-server:start-game, from-server:next-turn, from-server:finish-game
 *	Possible sending messages: from-client:c, from-clent:loaded-game, from-clent:started-game, from-client:submit-turn, from-client:finish-game
 *	Message can possibly contains: player_id, current_turn_player_id, player_game_name, action_type, action_params, message
 */

var ManagerSocket = {
	idle_sockets : {},
	sockets_map : {},
}

exports.Listen = function (server) {
	io = socket_io.listen(server, {log: false});

	io.sockets.on('connection', function (socket) {
		socket.join('lobby');
		socket.on('from-client:c', function (data) {
			var player_id = data['player_id'];
			if (player_id != null) {
				var player = manager_user.GetUser(player_id);
				if (player == null)	{
					logger_model.error('io.sockets on connection: player_id is not valid');
					return;
				}
				var game_id = player.GetData('game');
				var game = manager_game.GetGame(game_id);
				if (game != null) {
					logger_model.error('User refreshed');
					manager_game.DeleteGame(game_id);
				}
				ManagerSocket.idle_sockets[player_id] = socket;
				manager_user.QueuePlayer(player_id);
				var matched_game = manager_game.MatchMaking();
				if (matched_game) {
					ManagerSocket.sockets_map[socket.id] = matched_game.game_id;
					var other_player_id = matched_game.GetOtherUserId(player_id);
					ManagerSocket.sockets_map[ManagerSocket.idle_sockets[other_player_id].id] = matched_game.game_id;
					matched_game.PruneSockets(ManagerSocket.idle_sockets);
					matched_game.Load();
				}
			}
			else {
				logger_model.error('io.sockets on connection: player_id not valid');
				return;
			}
		});
		socket.on('from-client:loaded-game', function (data) {
			var player_id = data['player_id'];
			var player = manager_user.GetUser(player_id);
			if (player == null) logger_model.error('from-client:loaded-game: player_id %s is not valid. ' + player_id);
			var game_id = player.GetData('game');
			var game = manager_game.GetGame(game_id);
			if (game == null) logger_model.error('from-client:loaded-game: game_id %s is not valid. ' + game_id);
			else {
				var cur_game_status = game.SetStatus(player_id, 'ui');
				logger_model.info('from-client:loaded-game: game same status is ' + cur_game_status);
				if (cur_game_status == 'ui')	{
					game.Start();
				}
			}
		});
		socket.on('from-client:submit-turn', function (data) {
			var player_id = data['player_id'];
			var player = manager_user.GetUser(player_id);
			if (player == null) logger_model.error('from-client:submit-turn: player_id %s is not valid. ' + player_id);
			var game_id = player.GetData('game');
			var game = manager_game.GetGame(game_id);
			if (game == null) logger_model.error('from-client:submit-turn: game_id %s is not valid. ' + game_id);
			else game.Submit(data);
		});
		socket.on('disconnect', function () {
			var game_id = ManagerSocket.sockets_map[socket.id];
			var game = manager_game.GetGame(game_id);
			if (game != null) {
				logger_model.info('socket disconnect: game deleted ' + game_id);
				if (ManagerSocket.sockets_map[socket.id] != null)
					delete ManagerSocket.sockets_map[socket.id];
				game.Disconnect();
			}
		});
	});
}

exports.Speak = function (event, game_id, params) {
	logger_model.info([event, game_id, params]);
	io.sockets.in(game_id).emit(event, params);
}