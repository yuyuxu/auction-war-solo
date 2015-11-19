/** Model (static, front end, game) that contains the game,
 * this is the main entrance from the initializer.
 * Specifically, it manage the game flow and players.
 */
var Game = {
  /** Current game type.
   * @type {integer}
   */
  game_type: -1,

  /** Whose turn is it.
   * @type {integer}
   */
  whose_turn: -1,

  /** List of players.
   * @type {Array.<Player>}
   */
  players: [],

  /** Game flow indicator, whether if it's finished.
   * @type {boolean}
   */
  is_game_finished: false,

  /** API. Init current game.
   * @param {string} player_id - the id of current player.
   * @param {integer} type - type of the game, it's a constant.
   */
  Init: function(player_id, type) {
    // set game type
    this.game_type = type;

    // init scene
    ManagerScene.Init();

    // setup game controller
    ControllerGamePage.Init();

    // setup plyaer according to game type
    ManagerPlayer.Init(player_id);

    // start game flow
    this.FlowMatchMaking();
  },

  CreatePlayer: function(player_id) {
    if (ManagerGame.game_type == HumanVsScripted) {
      this.CreatePlayer(player_id, TypePlayer, LayoutSidePlayer);
      this.CreatePlayer('scripted', TypeScripted, LayoutSideOpponent);
    } else {
      Logger.Log('ManagerPlayer init: game type not supported ' +
                             ManagerGame.game_type);
    }
  },

  GetCurrentPlayer: function() {
    if (this.whose_turn < 0) {
      Logger.Log('GetCurrentPlayer whose_turn has not init yet.');
      return null;
    }

    return ManagerPlayer.players[this.whose_turn];
  },

  // lost of binding
  FlowMatchMaking: function() {
    if (this.game_type == HumanVsScripted) {
      ManagerScene.EnableComponentInGame('none');
      var wait_time = Math.random() * RandomWaitingTime;
      Logger.Log('FlowMatchMaking: game start in ' +
                             wait_time + ' seconds (' +
                             this.game_type + ')');
      ManagerScene.StartTimer(
        wait_time,
        ManagerScene.HandlerTickerGameStateMessage,
        ['Please wait while we are finding an opponent for you '],
        this.FlowLoadGame,
        null);
    } else {
      Logger.Log('FlowMatchMaking game type not yet supported ' +
                             this.game_type);
    }
  },

  // lost of binding
  FlowLoadGame: function() {
    if (ManagerGame.game_type == HumanVsScripted) {
      PageTitleNotification.On('Opponent Found ...');
      ManagerScene.EnableComponentInGame('none');
      var wait_time = Math.random() * RandomWaitingTime;
      Logger.Log('FlowLoadGame: game start in ' +
                             wait_time + ' seconds (' +
                             ManagerGame.game_type + ')');
      ManagerScene.StartTimer(
        wait_time,
        ManagerScene.HandlerTickerGameStateMessage,
        ['You are ready. Please wait for your opponent to get ready '],
        ManagerGame.FlowStep,
        [null, '']);
    } else {
      Logger.Log('FlowLoadGame game type not supported ' +
                             ManagerGame.game_type);
    }
  },

  // lost of binding
  FlowStep: function(params) {
    // validation
    if (ManagerGame.is_game_finished) {
      Logger.Log('FlowStep error: game is already finished');
    }
    if (params.length != 2) {
      Logger.Log('FlowStep error: params size has to be 2, ' +
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
    Logger.Log('FlowStep: whose_turn ' + ManagerGame.whose_turn);

    // update items
    if (params[0] != null) {
      ManagerScene.MoveItems(params[0]);
    }

    // update page notice, game page, scene component and animation
    if (ManagerGame.GetCurrentPlayer().player_type == TypePlayer) {
      PageTitleNotification.On('Your Turn ...');
      ManagerScene.ResetTimer();
      ManagerScene.EnableComponentInGame('game');
      ViewGamePage.Reset();
      ViewGamePage.DisplayMessage('game-message', params[1]);
      ViewGamePage.DisplayMessage('game-state', 'Your turn');
    } else {
      PageTitleNotification.On('Wait for Your Turn ...');
      ManagerScene.EnableComponentInGame('none');
      ManagerScene.StartTimer(-1,
                              ManagerScene.HandlerTickerGameStateMessage,
                              ['Please wait for you turn '],
                              null,
                              null);
      ViewGamePage.Reset();
    }

    // player logic
    ManagerGame.GetCurrentPlayer().StartTurn();
  },

  FlowFinishGame: function() {
    Logger.Log('FlowFinishGame game finished ');

    PageTitleNotification.On('Game Finished ...');
    ManagerScene.EnableComponentInGame('none');

    ViewGamePage.Reset();
    ViewGamePage.DisplayMessage('game-state', 'Game Finished!');
    ViewGamePage.DisplayDiv('#next-stage-div', true);
    ViewGamePage.DisplayDiv('#curr-stage-div', false);

    var submit_data = ControllerGamePage.action_history;
    $('#submit-data').val(submit_data);

    this.is_game_finished = true;
  },
};