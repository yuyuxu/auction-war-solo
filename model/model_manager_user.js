var User = require('./model_user');
var logger_model = require('../utility/logger').GetLogger('model');

/**
 * Singleton manager that contain user model
 */
var ManagerUser = (function () {
  var instance = null;
  var users_map = {};
  var users_match_making = {};

  function Init () {
		return {
			CreateUser: function (user_id) {
				users_map[user_id] = new User(user_id);
				return users_map[user_id];
			},

			GetUser: function (user_id) {
				return users_map[user_id];
			},

			GetUsers : function () {
				return users_map;
			},

			HasUser : function (user_id) {
				if (users_map[user_id] == null)	return false;
				return true;
			},

			QueuePlayer : function (user_id) {
				var ManagerGame = require('./model_manager_game').GetInstance();
				var player = this.GetUser(user_id);
				if (player == null) {
					logger_model.error('player ' + user_id + ' does not exist in user list');
					return;
				}
				if (users_match_making[user_id] != null) {
					logger_model.warn('Probably refreshed: player ' + user_id + ' already exists in users_match_making');
				}
				users_match_making[user_id] = player;
			},

			UnqueuePlayers : function (user_ids) {
				for (var i = 0; i < user_ids.length; i++) {
					if (users_match_making[user_ids[i]] != null) {
						delete users_match_making[user_ids[i]];
					}
				}
			},

			GetQueuedPlayers : function () {
				return users_match_making;
			},

			AssignRole : function (user_id) {
				var numsam = 0;
				var numalex0 = 0;
				var numalex1 = 0;
				for (var k in users_map) {
					if (k == user_id) continue;
					if (users_map[k].GetData('role') == 'Sam-0') numsam = numsam + 1;
					if (users_map[k].GetData('role') == 'Alex-0') numalex0 = numalex0 + 1;
					if (users_map[k].GetData('role') == 'Alex-1') numalex1 = numalex1 + 1;
				}
				if ((numalex0 + numalex1) < numsam) {
					if (numalex1 < numalex0) {
						users_map[user_id].SetData('role', 'Alex-1');
					}
					else {
						users_map[user_id].SetData('role', 'Alex-0');
					}
				}
				else {
					users_map[user_id].SetData('role', 'Sam-0');
				}
				logger_model.info([numsam, numalex0, numalex1], 'AssignRole');
				return users_map[user_id].GetData('role');
			},
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

module.exports = ManagerUser;