/** Model (object) for front end game player.
 * @param {string} id - player id.
 * @param {string} type - player type.
 * @param {string} side - player side.
 */
function Player(id, type, side) {
  /** Player id. */
  this.player_id = id;

  /** Player type. */
  this.player_type = type;

  /** Game related information and logic. */
  /** Player side. */
  this.player_side = side;

  /** How many turns has current played went through. */
  this.turn_number = -1;
}

/** What player does when turn starts. */
Player.prototype.StartTurn = function() {
  this.turn_number = this.turn_number + 1;
  Logger.Log('StartTurn turn number: ' + this.turn_number + ' player type: ' +
              this.player_type);
  if (this.player_type == TypePlayer) {
    // human player do nothing here
  } else if (this.player_type == TypeScripted) {
    // simulate one step
    var turn_number = this.turn_number;
    var item_locations;
    if (turn_number >= ScriptConcession.length) {
      this.indicate_finish = true;
      item_locations = ScriptConcession[ScriptConcession.length - 1];
    } else {
      item_locations = ManagerSceneItem.ExportItemLocations();
      value_on_table =
        ManagerSceneItem.ComputeCurrentItemValue(LayoutSideOpponent);
      value_proposed =
        ManagerSceneItem.ComputeItemValueGivenLocations(item_locations,
                                                        LayoutSideOpponent);
      if (value_on_table[0] > value_proposed[0]) {
        this.indicate_finish = true;
        if (ManagerGame.GetNextPlayer().indicate_finish) {
          ManagerGame.FlowFinishGame();
          return;
        }
      } else {
        this.indicate_finish = false;
        item_locations = ScriptConcession[turn_number];
      }
    }
    var wait_time = Math.random() * RandomWaitingTime;
    Logger.Log('indicate_finish ' + this.indicate_finish);
    Logger.Log('item_locations ' + JSON.stringify(item_locations));

    // after simulation
    ManagerSceneTimer.StartTimer(
      wait_time,
      ManagerScene.HandlerTickerGameStateMessage,
      ['Please wait for you turn '],
      this.FinishTurn,
      [item_locations, '']);
  } else {
    Logger.Log('Player StartTurn: player type not supported ' +
                           this.player_type);
  }
}

/** What player does when turn finishes. */
Player.prototype.FinishTurn = function(params) {
  ManagerGame.FlowStep(params);
}