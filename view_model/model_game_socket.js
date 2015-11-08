/**
 * This module deals with interface that receives message from server.
 *  socket = io.connect('http://localhost:3000', {'force new connection': true});
 * 
 * Some notes on the messages style:
 *	Message: use '-', ':'
 *	Possible receiving messages: from-server:dc, from-server:load-game, from-server:start-game, from-server:next-turn, from-server:finish-game
 *	Possible sending messages: from-client:c, from-clent:start-game, from-client:submit-turn, from-client:finish-game
 *	Message can possibly contains: player_id, current_turn_player_id, player_game_name, action_type, action_params, message
 */
var ModuleGameEventSocket = {
	socket : null,

	Init : function () {
		this.socket = io.connect('', {});
		var inner_socket = this.socket;
		inner_socket.on('connect', function () {
			inner_socket.on('from-server:dc', function (data) {
				var received_id = data['player_id'];
				if (ModuleGame.player_id == received_id) {
					var message = 'Your opponent ' + ModuleGame.opponent_game_name + ' has left. Refresh page (press F5) to start again.';
					ModuleGameRendering.ResetTimer();
					ModuleGameRendering.EnableCompInGame('none');
					ModuleGameController.ResetInterface('disable');
					if (!ModuleGame.game_finished)
						ModuleGameRendering.Display('game-state', message);
				}
			});
			inner_socket.on('from-server:load-game', function (data) {
				var alertmsg = 'Opponent found! Thank you for your patience.';
				if (ModuleGame.player_id == data['player_id']) {
					ModuleGame.player_game_name = data['player_game_name'];
					ModuleGameRendering.SetBackgroundLabel(1, 'Area: You (' + ModuleGame.player_game_name + ')');
					ModuleGame.FlowLoadGame(data['time']);
				}
				else {
					ModuleGame.opponent_game_name = data['player_game_name'];
					ModuleGameRendering.SetBackgroundLabel(2, 'Area: Opponent (' + ModuleGame.opponent_game_name + ')');
				}
			});
			inner_socket.on('from-server:start-game', function (data) {
				if (ModuleGame.player_id == data['player_id']) {
					ModuleGame.FlowStartTurn();
				}
				else {
					ModuleGame.FlowWaitTurn();
				}
			});
			inner_socket.on('from-server:next-turn', function (data) {
				var id = data['player_id'];
				var action = data['action_type'];

				if (ModuleGame.player_id != id) {
					ModuleGame.FlowWaitTurn();
				}
				else {
					if (action == 'submit') {
						var params = data['action_params'];
						var message = '';
						if (params.length > 1 && params[1] != '')	message += 'Opponent said: "' + params[1] + '"';
						ModuleGame.has_opponent_accepted_offer = false;
						ModuleGame.FlowUpdateTurn(params[0]);
						ModuleGame.FlowStartTurn(message);
					}
					else if (action == 'accept') {
						ModuleGame.has_opponent_accepted_offer = true;
						ModuleGame.FlowStartTurn(message);
					}
				}
			});
			inner_socket.on('from-server:finish-game', function (data) {
				ModuleGameRendering.ResetTimer();
				ModuleGameRendering.EnableCompInGame('none');
				ModuleGameController.ResetInterface('disable');
				ModuleGame.FlowFinishGame();
			});
		});
	},

	Trigger : function (event_name, params) {
		this.socket.emit(event_name, params);
	},

};