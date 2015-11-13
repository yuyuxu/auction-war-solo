var ManagerPlayer = {
  players: [],

  Init: function(player_id) {
    if (ManagerGame.game_type == HumanVsScripted) {
      this.CreatePlayer(player_id, TypePlayer, LayoutSidePlayer);
      this.CreatePlayer('scripted', TypeScripted, LayoutSideOpponent);
    } else {
      InitializerUtility.Log('ManagerPlayer init: game type not supported ' +
                             ManagerGame.game_type);
    }
  },

  Player: function(id, type, side) {
    // keys
    this.player_id = id;
    this.player_type = type;

    // game realted variable
    this.player_side = side;
    this.indicate_finish = false;
    this.turn_number = -1;

    this.StartTurn = function() {
      this.turn_number = this.turn_number + 1;
      if (this.player_type == TypePlayer) {
        // human player do nothing here
      } else if (this.player_type == TypeScripted) {
        // simulate one step
        this.indicate_finish = false;
        var turn_number = this.turn_number;
        if (turn_number >= ScriptConcession.length) {
          turn_number = ScriptConcession.length;
        }
        var item_locations = ScriptConcession[turn_number];
        var wait_time = Math.random() * RandomWaitingTime;

        InitializerUtility.Log('StartTurn turn number: ' +
                               turn_number + ' player type: ' +
                               this.player_type + ' next scripted items: ' +
                               JSON.stringify(item_locations) + ' wait time ' +
                               wait_time);

        // after simulation
        ManagerScene.StartTimer(
          wait_time,
          ManagerScene.HandlerTickerGameStateMessage,
          ['Wait for your turn '],
          this.FinishTurn,
          [item_locations, '']);
      } else {
        InitializerUtility.Log('Player StartTurn: player type not supported ' +
                               this.player_type);
      }
    };

    this.FinishTurn = function(params) {
      ManagerGame.FlowStep(params);
    };
  },

  CreatePlayer: function(id, type, side) {
    this.players.push(new this.Player(id, type, side));
    InitializerUtility.Log('CreatePlayer: created new player ' +
                           id + ' ' + type + ' ' + side);
  },

  PlayersFinished: function() {
    for (var i = 0; i < this.players.length; ++i) {
      if (this.players[i].indicate_finish == false) {
        return false;
      }
    }
    return true;
  }
};