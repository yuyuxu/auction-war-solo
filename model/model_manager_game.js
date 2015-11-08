var ManagerDB = require('../data_access/aws_dynamodb');
var Game = require('./model_game');
var ManagerUser = require('./model_manager_user').GetInstance();
var LoggerModel = require('../utility/logger').GetLogger('model');

/**
 * Singleton manager that contains all games
 *  Note: putting ManagerUser = require ... to the end of the file because of circular dependency
 */
var ManagerGame = (function () {
  var instance = null;
  var games_map = {};

  function Init () {
		return {
			CreateGame : function (array_user_ids) {
				var game_id = ManagerDB.MakeId();
				var game = new Game(game_id, array_user_ids);
				games_map[game_id] = game;
				game.Init();
				
				return games_map[game_id];
			},

			DeleteGame : function (game_id) {
				if (games_map[game_id] != null) {
					delete games_map[game_id];
				}
			},	

			GetGame : function (game_id) {
				return games_map[game_id];
			},

			GetGames : function () {
				return games_map;
			},

			HasGame : function (game_id) {
				if (games_map[game_id] == null)	return false;
				return true;
			},

			MatchMaking : function () {
				var ManagerUser = require('./model_manager_user').GetInstance();
				var player1 = null;
				var player2 = null;
				var queued_players = ManagerUser.GetQueuedPlayers();
				for (var k in queued_players) {
					if (player1 == null) {
						player1 = queued_players[k];
						continue;
					}
					else if (player2 == null && k != player1.user_id) {
						player2 = queued_players[k];
						if (player1.GetGameName() != player2.GetGameName())	break; 
						else	{
							player2 = null;
							continue;
						}
					}
				}
				if (player1 != null && player2 != null) {
					var game = this.CreateGame([player1.user_id, player2.user_id]);
					player1.SetData('game', game.game_id);
					player2.SetData('game', game.game_id)
					ManagerUser.UnqueuePlayers([player1.user_id, player2.user_id]);
					return game;
				}
			}
		};
	};
	return {
		GetInstance: function () {
			if (!instance) {
				instance = Init();
			}
			return instance;
		}
	};
 
})();

module.exports = ManagerGame;
