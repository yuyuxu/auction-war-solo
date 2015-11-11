var ManagerPlayer = {
  players: [],

  Init: function(player_id, game_type) {
    if (ManagerGame.game_type == HumanVsScripted) {
      CreatePlayer(player_id, TypePlayer);
      CreatePlayer('scripted', TypeScripted);
    } else {
      InitializerUtility.Log('ManagerPlayer init: game type not supported ' +
                             game_type);
    }
  },

  Player: function(id, type) {
    this.player_id = id;
    this.player_type = type;

    this.StartTurn = function() {
      if (this.player_type == TypePlayer) {
        // do nothing
      } else if (this.player_type == TypeScripted) {
        // simulate one step
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
    players.push(new Player(id, type));
    InitializerUtility.Log('CreatePlayer: created new player ' +
                           id + ' ' + type);
  },
};