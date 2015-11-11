// This module is the game manager for 2 player game,
// it manages the game state/flow, game players
var ManagerGame = {
  game_type: -1,
  whose_turn: -1,
  is_game_finished: false,

  Init: function(player_id, type) {
    // set game type
    this.game_type = type;

    // init scene
    ManagerScene.Init();

    // setup game controller
    ManagerController.Init();

    // setup plyaer according to game type
    ManagerPlayer.Init(player_id);

    // start game flow
    this.FlowMatchMaking();
  },

  GetCurrentPlayer: function() {
    if (this.whose_turn < 0) {
      InitializerUtility.Log('GetCurrentPlayer whose_turn has not init yet.');
      return null;
    }

    return ManagerPlayer[this.whose_turn];
  },

  FlowMatchMaking: function() {
    if (this.game_type == HumanVsScripted) {
      ManagerScene.EnableComponentInGame('none');
      var matching_time = Math.random() * 60;
      InitializerUtility.Log('FlowMatchMaking: game start in ' +
                             matching_time + ' seconds (' +
                             this.game_type + ')');
      ManagerScene.StartTimer(
        matching_time,
        ManagerScene.HandlerGameStateMessage,
        ['Please wait while we are finding an opponent for you '],
        this.FlowLoadGame,
        null);
    } else {
      InitializerUtility.Log('FlowMatchMaking game type not yet supported ' +
                             this.game_type);
    }
  },

  // lost in binding
  FlowLoadGame: function() {
    if (ManagerGame.game_type == HumanVsScripted) {
      PageTitleNotification.On('Opponent Found ...');
      ManagerScene.EnableComponentInGame('none');
      ManagerScene.StartTimer(
        Math.random() * 15,
        ManagerScene.HandlerGameStateMessage,
        ['Yes you are ready! Just wait for your opponent to get ready '],
        ManagerGame.FlowStep,
        ['Your Turn ...', '', null]);
    } else {
      InitializerUtility.Log('FlowLoadGame game type not supported ' +
                             ManagerGame.game_type);
    }
  },

  // lost in binding
  FlowStep: function(params) {
    if (params.length != 2) {
      InitializerUtility.Log('FLowRunTurn error: params size has to be 2, ' +
                             '[game page message, items]');
      return;
    }

    // compute which player's turn is this step
    if (ManagerGame.whose_turn < 0) {
      ManagerGame.whose_turn = StartPlayer;
    } else {
      ManagerGame.whose_turn = (ManagerGame.whose_turn + 1) %
                               ManagerPlayer.players.length;
    }

    // update items
    ManagerScene.MoveItems(params[1], 'reverse');

    // update page notice, game page, scene component and animation
    if (ManagerGame.GetCurrentPlayer().player_type == TypePlayer) {
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
    ManagerGame.GetCurrentPlayer().StartTurn();
  },

  FlowFinishGame: function() {
    this.is_game_finished = true;

    ManagerController.ShowDiv('#next-stage-div', true);
    ManagerController.ShowDiv('#submit-div', false);
    GamePageHelper.DisplayMessage('game-state', 'Game Finished!');

    var submit_data = ManagerController.action_history;
    $('#submit-data').val(submit_data);
  },
};