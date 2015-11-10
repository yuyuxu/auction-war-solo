// This module is the game manager
// manager the game state/flow, game players
var ModuleGame = {
  player_id: '',
  opponent_id: '',
  player_game_name: '',
  opponent_game_name: '',

  is_your_turn: false,
  game_finished: false,
  has_opponent_accepted_offer: false,

  Init: function() {
    // setup scene & item
    ModuleGameRendering.SetupScene();
    this.LoadItems();

    // setup game communication
    this.player_id = $('#player-id').val();
    var static_page = false;
    if (!static_page) ModuleGameEventSocket.Init();
    ModuleGameController.Init();

    // initial game
    this.FlowMatchMaking();

    // redraw
    ModuleGameRendering.Redraw();
  },

  LoadItems: function() {
    ModuleGameRendering.SetupItem(ModuleGameItems.CreateItem(0));
    ModuleGameRendering.SetupItem(ModuleGameItems.CreateItem(1));
    ModuleGameRendering.SetupItem(ModuleGameItems.CreateItem(1));
    ModuleGameRendering.SetupItem(ModuleGameItems.CreateItem(2));
    ModuleGameRendering.SetupItem(ModuleGameItems.CreateItem(2));
    ModuleGameRendering.SetupItem(ModuleGameItems.CreateItem(2));
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

    // Debug
    var r = confirm('Opponent Found...');
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
    // Debug
    var r = confirm('Your Turn is Ready...');
    PageTitleNotification.On('Your Turn...');
    ClientLog(ModuleGame.player_id + ' ' + 'FlowStartTurn');
    this.is_your_turn = true;
    ModuleGameController.ResetInterface();
    ModuleGameRendering.EnableCompInGame('game');
    ModuleGameRendering.StartTimer(-1, ModuleGameRendering.HandlerLabelAnimation, ['Your turn ']);
    ModuleGameRendering.Display('game-message', message);

    // testing framework
    if (this.is_testing) {
      if (this.testing_turn_count >= TestNoTurns)
        ModuleGameController.MediatorActions('accept', []);
      else {
        ModuleGameController.MediatorActions('submit', [[2, 2, 2, 2, 2, 2], 'Suck it!']);
        this.testing_turn_count = this.testing_turn_count + 1;
      }
    }
  },

  FlowUpdateTurn: function(items) {
    ModuleGameItems.MoveItems('reverse', items);
  },

  FlowFinishGame: function() {
    // Debug
    var r = confirm('Game Finished...');
    ModuleGameController.ShowDiv('#nextstagediv', true);
    ModuleGameController.ShowDiv('#submitdiv', false);
    ModuleGameRendering.Display('game-state', 'Game Finished!');
    this.game_finished = true;
    var submit_data = ModuleGameController.action_history;
    $('#submit-data').val(submit_data);

    // testing framework
    if (this.is_testing) {
      $('#nextstage').trigger('click');
    }
  }
};