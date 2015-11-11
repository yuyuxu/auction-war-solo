// This module is the game manager for 2 player game,
// it manages the game state/flow, game players
var ManagerGame = {
  game_type: -1,
  whose_turn: -1,
  is_game_finished: false,

  Init: function(player_id, type) {
    // set game type
    game_type = type;

    // init scene
    ManagerScene.Init();

    // setup game controller
    ManagerController.Init();

    // setup plyaer according to game type
    ManagerPlayer.Init(player_id);

    // start game flow
    FlowMatchMaking();
  },

  GetNextPlayer: function() {

  }

  FlowMatchMaking: function() {
    if (type == GameLocal) {
      ManagerScene.EnableComponentInGame('none');
      ManagerScene.StartTimer(
        Math.random() * 60,
        ManagerScene.HandlerGameStateMessage,
        ['Please wait while we are finding an opponent for you '],
        FlowLoadGame,
        null);
    } else {
      InitializerUtility.Log('FlowMatchMaking game type not supported ' +
                             game_type);
    }
  },

  FlowLoadGame: function() {
    if (type == GameLocal) {
      PageTitleNotification.On('Opponent Found...');
      ManagerScene.StartTimer(
        Math.random() * 15,
        ManagerScene.HandlerGameStateMessage,
        ['Yes you are ready! Just wait for your opponent to get ready '],
        FlowStep,
        ['Your Turn ...', '', null]);
    } else {
      InitializerUtility.Log('FlowLoadGame game type not supported ' +
                             game_type);
    }
  },

  FlowStep: function(params) {
    if (params.length != 2) {
      InitializerUtility.Log('FLowRunTurn error: params size has to be 2, ' +
                             '[game page message, items]');
      return;
    }

    // compute which player's turn is this step
    if (whose_turn < 0) {
      whose_turn = StartPlayer;
    } else {
      whose_turn = (whose_turn + 1) % ManagerPlayer.players.length;
    }

    // update items
    ManagerScene.MoveItems(params[1], 'reverse');

    // update page notice, game page, scene component and animation
    if (ManagerPlayer.players[whose_turn].player_type == TypePlayer) {
      PageTitleNotification.On('Your Turn ...');
      GamePageHelper.Reset();
      GamePageHelper.DisplayMessage(params[0]);
      ManagerScene.EnableComponentInGame('game');
      ManagerScene.StartTimer(-1,
                              ManagerScene.HandlerGameStateMessage,
                              null,
                              null,
                              null);
    } else {
      PageTitleNotification.On('Wait for Your Turn ...');
      GamePageHelper.Reset();
      ManagerScene.EnableComponentInGame('none');
      ManagerScene.StartTimer(-1,
                              ManagerScene.HandlerGameStateMessage,
                              ['Please wait for you turn '],
                              null,
                              null);
    }

    // player logic
    ManagerPlayer.players[whose_turn].StartTurn();
  },

  FlowFinishGame: function() {
    this.is_game_finished = true;

    ModuleGameController.ShowDiv('#next-stage-div', true);
    ModuleGameController.ShowDiv('#submit-div', false);
    GamePageHelper.DisplayMessage('game-state', 'Game Finished!');

    var submit_data = ManagerController.action_history;
    $('#submit-data').val(submit_data);
  },
};