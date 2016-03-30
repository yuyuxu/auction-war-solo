/** Model (static, front end, game) that contains the game,
 * this is the main entrance from the initializer.
 * Specifically, it manage the game flow and players.
 */
var ManagerGame = {
  /** Current game type.
   * @type {integer}
   */
  game_type: -1,

  /** List of players.
   * @type {Array<Object>}
   */
  players: [],

  /** Whose turn is it.
   * @type {integer}
   */
  whose_turn: -1,

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

    // setup player according to game type
    this.CreatePlayer(player_id);

    // start game flow
    this.FlowMatchMaking();
  },

  CreatePlayer: function(player_id) {
    if (ManagerGame.game_type == HumanVsScripted) {
      player1 = new Player(player_id, TypePlayer, LayoutSidePlayer);
      player2 = new Player('007', TypeScripted, LayoutSideOpponent);
      this.players.push(player1);
      this.players.push(player2);
    } else {
      Logger.Log('CreatePlayer: game type not supported ' +
                             ManagerGame.game_type);
    }
  },

  GetCurrentPlayer: function() {
    if (this.whose_turn < 0) {
      Logger.Log('GetCurrentPlayer whose_turn has not init yet.');
      return null;
    }

    return this.players[this.whose_turn];
  },

  GetNextPlayer: function() {
    if (this.whose_turn < 0) {
      Logger.Log('GetCurrentPlayer whose_turn has not init yet.');
      return null;
    }

    next_turn = (this.whose_turn + 1) % this.players.length;
    return this.players[next_turn];
  },

  // lost of binding
  FlowMatchMaking: function() {
    if (this.game_type == HumanVsScripted) {
      ManagerScene.EnableComponentInGame('none');
      ViewGamePage.Reset(false, '');
      var wait_time = WaitingTimeMatchMaking;
      // Logger.Log('FlowMatchMaking: game start in ' +
      //                        wait_time + ' seconds (' +
      //                        this.game_type + ')');
      ManagerSceneTimer.StartTimer(
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
      // PageTitleNotification.On('Opponent Found ...');
      var wait_time = WaitingTimeLoadGame;
      // Logger.Log('FlowLoadGame: game start in ' +
      //                        wait_time + ' seconds (' +
      //                        ManagerGame.game_type + ')');
      ManagerSceneTimer.StartTimer(
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
      return;
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
                               ManagerGame.players.length;
    }

    // update items
    if (params[0] != null) {
      ManagerScene.MoveItems(params[0]);
    }

    // update rendering
    if (ManagerGame.GetCurrentPlayer().player_type == TypePlayer) {
      // PageTitleNotification.On('Your Turn ...');
      ManagerSceneTimer.ResetTimer();
      ManagerScene.EnableComponentInGame('game');
      ViewGamePage.Reset(true, ManagerGame.GetNextPlayer().indicate_finish);
      ViewGamePage.DisplayMessage('#game-message', params[1]);
      ViewGamePage.DisplayMessage('#game-state', 'Your turn');
    } else {
      // PageTitleNotification.On('Wait for Your Turn ...');
      ViewGamePage.Reset(false, ManagerGame.GetNextPlayer().indicate_finish);
      ManagerScene.EnableComponentInGame('none');
      ViewGamePage.DisplayMessage('#game-state', 'Please wait for you turn ');
    }

    // player logic
    ManagerGame.GetCurrentPlayer().StartTurn();
  },

  FlowFinishGame: function() {
    Logger.Log('FlowFinishGame game finished ');

    // PageTitleNotification.On('Game Finished ...');
    ManagerScene.EnableComponentInGame('none');
    ViewGamePage.Reset(false, false);

    ViewGamePage.DisplayMessage('#game-state',
      'You and your opponent agreed upon the split of the items, ' +
      'so the negotiation is completed !');
    ViewGamePage.DisplayDiv('#next-stage-div', true);
    ViewGamePage.DisplayDiv('#curr-stage-div', false);
    this.is_game_finished = true;

    // submit data
    $('#submit-data').val(JSON.stringify(ManagerController.log_actions));
    Logger.Log('FlowFinishGame action log: ' +
               JSON.stringify(ManagerController.log_actions));
  },
};