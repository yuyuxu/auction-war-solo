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

    return ManagerPlayer.players[this.whose_turn];
  },

  // lost of binding
  FlowMatchMaking: function() {
    if (this.game_type == HumanVsScripted) {
      ManagerScene.EnableComponentInGame('none');
      var wait_time = Math.random() * RandomWaitingTime;
      InitializerUtility.Log('FlowMatchMaking: game start in ' +
                             wait_time + ' seconds (' +
                             this.game_type + ')');
      ManagerScene.StartTimer(
        wait_time,
        ManagerScene.HandlerTickerGameStateMessage,
        ['Please wait while we are finding an opponent for you '],
        this.FlowLoadGame,
        null);
    } else {
      InitializerUtility.Log('FlowMatchMaking game type not yet supported ' +
                             this.game_type);
    }
  },

  // lost of binding
  FlowLoadGame: function() {
    if (ManagerGame.game_type == HumanVsScripted) {
      PageTitleNotification.On('Opponent Found ...');
      ManagerScene.EnableComponentInGame('none');
      var wait_time = Math.random() * RandomWaitingTime;
      InitializerUtility.Log('FlowLoadGame: game start in ' +
                             wait_time + ' seconds (' +
                             ManagerGame.game_type + ')');
      ManagerScene.StartTimer(
        wait_time,
        ManagerScene.HandlerTickerGameStateMessage,
        ['You are ready. Please wait for your opponent to get ready '],
        ManagerGame.FlowStep,
        [null, '']);
    } else {
      InitializerUtility.Log('FlowLoadGame game type not supported ' +
                             ManagerGame.game_type);
    }
  },

  // lost of binding
  FlowStep: function(params) {
    // validation
    if (ManagerGame.is_game_finished) {
      InitializerUtility.Log('FlowStep error: game is already finished');
    }
    if (params.length != 2) {
      InitializerUtility.Log('FlowStep error: params size has to be 2, ' +
                             '[items, game page message]');
      return;
    }

    // compute which player's turn is this step
    if (ManagerGame.whose_turn < 0) {
      ManagerGame.whose_turn = StartPlayer;
    } else {
      ManagerGame.whose_turn = (ManagerGame.whose_turn + 1) %
                               ManagerPlayer.players.length;
    }
    InitializerUtility.Log('FlowStep: whose_turn ' + ManagerGame.whose_turn);

    // update items
    if (params[0] != null) {
      ManagerScene.MoveItems(params[0]);
    }

    // update page notice, game page, scene component and animation
    if (ManagerGame.GetCurrentPlayer().player_type == TypePlayer) {
      PageTitleNotification.On('Your Turn ...');
      ManagerScene.ResetTimer();
      ManagerScene.EnableComponentInGame('game');
      GamePageHelper.Reset();
      GamePageHelper.DisplayMessage('game-message', params[1]);
      GamePageHelper.DisplayMessage('game-state', 'Your turn');
    } else {
      PageTitleNotification.On('Wait for Your Turn ...');
      ManagerScene.EnableComponentInGame('none');
      ManagerScene.StartTimer(-1,
                              ManagerScene.HandlerTickerGameStateMessage,
                              ['Please wait for you turn '],
                              null,
                              null);
      GamePageHelper.Reset();
    }

    // player logic
    ManagerGame.GetCurrentPlayer().StartTurn();
  },

  FlowFinishGame: function() {
    InitializerUtility.Log('FlowFinishGame game finished ');

    PageTitleNotification.On('Game Finished ...');
    ManagerScene.EnableComponentInGame('none');

    GamePageHelper.Reset();
    GamePageHelper.DisplayMessage('game-state', 'Game Finished!');
    GamePageHelper.DisplayDiv('#next-stage-div', true);
    GamePageHelper.DisplayDiv('#curr-stage-div', false);

    var submit_data = ManagerController.action_history;
    $('#submit-data').val(submit_data);

    this.is_game_finished = true;
  },
};