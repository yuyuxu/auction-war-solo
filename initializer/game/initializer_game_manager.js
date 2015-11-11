// This module is the game manager for 2 player game,
// it manages the game state/flow, game players
var ManagerGame = {
  // player information
  player_id: '',
  opponent_id: '',
  player_game_name: '',
  opponent_game_name: '',

  // game status
  is_your_turn: false,
  game_finished: false,
  has_opponent_accepted_offer: false,

  Init: function() {
    // init scene
    ManagerScene.Init();

    // setup game controller
    ModuleGameController.Init();

    // setup game players
    ModuleGameListener.Init();

    // start game flow
    FlowMatchMaking();

    // redraw
    ManagerScene.Redraw();
  },

  ResetTurn: function() {
    ModuleGameController.curr_turn_statement = '';
    ModuleGameController.curr_turn_action = {};
    is_your_turn = false;
  },

  FlowMatchMaking: function() {
    var params = {
      player_id: this.player_id,
    };
    ModuleGameEventSocket.Trigger('from-client:c', params);
    ModuleGameRendering.EnableCompInGame('none');
    ModuleGameRendering.StartTimer(-1, ModuleGameRendering.HandlerLabelAnimation, ['Please wait while we are finding an opponent for you ']);
  },

  FlowLoadGame: function() {
    PageTitleNotification.On('Opponent Found...');
    var params = {
      player_id: this.player_id,
    };

    PageTitleNotification.Off();
    ModuleGameEventSocket.Trigger('from-client:loaded-game', params);
    ModuleGameRendering.StartTimer(-1, ModuleGameRendering.HandlerLabelAnimation, ['Yes you are ready! Just wait for your opponent to get ready ']);
  },

  FlowWaitTurn: function() {
    ClientLog(ModuleGame.player_id + ' ' + 'FlowWaitTurn');
    this.is_your_turn = false;
    ModuleGameRendering.StartTimer(-1, ModuleGameRendering.HandlerLabelAnimation, ['Please wait for you turn ']);
  },

  FlowStartTurn: function(message) {
    PageTitleNotification.On('Your Turn...');
    ClientLog(ModuleGame.player_id + ' ' + 'FlowStartTurn');

    this.is_your_turn = true;
    ModuleGameController.ResetInterface();
    ModuleGameRendering.EnableCompInGame('game');
    ModuleGameRendering.StartTimer(-1, ModuleGameRendering.HandlerLabelAnimation, ['Your turn ']);
    ModuleGameRendering.Display('game-message', message);
  },

  FlowUpdateTurn: function(items) {
    ModuleGameItems.MoveItems('reverse', items);
  },

  FlowFinishGame: function() {
    // Debug
    var r = confirm('Game Finished...');
    ModuleGameController.ShowDiv('#next-stage-div', true);
    ModuleGameController.ShowDiv('#submit-div', false);
    ModuleGameRendering.Display('game-state', 'Game Finished!');
    this.game_finished = true;
    var submit_data = ModuleGameController.action_history;
    $('#submit-data').val(submit_data);
  }
};