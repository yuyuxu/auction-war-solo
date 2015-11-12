var ManagerPlayer = {
  players: [],

  Init: function(player_id) {
    if (ManagerGame.game_type == HumanVsScripted) {
      this.CreatePlayer(player_id, TypePlayer);
      this.CreatePlayer('scripted', TypeScripted);
    } else {
      InitializerUtility.Log('ManagerPlayer init: game type not supported ' +
                             ManagerGame.game_type);
    }
  },

  Player: function(id, type) {
    this.player_id = id;
    this.player_type = type;
    this.indicate_finish = false;

    this.StartTurn = function() {
      if (this.player_type == TypePlayer) {
        // do nothing
      } else if (this.player_type == TypeScripted) {
        // simulate one step
        this.indicate_finish = true;
        this.FinishTurn(ManagerSceneItem.ExportItemLocations('reverse'),
                        'Hello World!');
      } else {
        InitializerUtility.Log('Player StartTurn: player type not supported ' +
                               this.player_type);
      }
    };

    this.FinishTurn = function(items, game_message) {
      ManagerGame.FlowStep([items, game_message]);
    };
  },

  CreatePlayer: function(id, type) {
    this.players.push(new this.Player(id, type));
    InitializerUtility.Log('CreatePlayer: created new player ' +
                           id + ' ' + type);
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