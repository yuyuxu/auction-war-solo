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
  Logger.Log('StartTurn turn number: ' + this.turn_number +
             ' player type: ' + this.player_type);
  // reset indicate finish for both players
  this.indicate_finish = false;
  if (this.player_type == TypePlayer) {
    // human player do nothing here
  } else if (this.player_type == TypeScripted) {
    // simulate one step
    // current turn number for player, start from 0
    var turn_number = this.turn_number;
    // final item location for update
    var item_locations;
    if (turn_number >= ScriptConcession.length) {
      // if turn number is larger than scripts
      // if already exceeded ExtraNumTurns, then directly terminate game.
      if (turn_number >= (ExtraNumTurns + ScriptConcession.length)) {
        this.indicate_finish = true;
        ManagerGame.FlowFinishGame();
        return;
      }
      // else just indicate finish and repeat last step
      this.indicate_finish = false;
      item_locations = ScriptConcession[ScriptConcession.length - 1];
    } else {
      // if turn number is within scripts
      item_locations = ManagerSceneItem.ExportItemLocations();
      proposed_locations = ScriptConcession[turn_number];
      if (turn_number == 0) {
        // if first turn, just use script location
        this.indicate_finish = false;
        item_locations = proposed_locations;
      } else {
        // otherwise, check values to see if indicate finish
        value_on_table =
          ManagerSceneItem.ComputeCurrentItemValue(LayoutSideOpponent);
        value_proposed =
          ManagerSceneItem.ComputeItemValueGivenInformation(proposed_locations,
                                                            LayoutSideOpponent);
        if (value_on_table[0] >= value_proposed[0]) {
          // if value on table better than next step value in script, finish
          this.indicate_finish = true;
          if (ManagerGame.GetNextPlayer().indicate_finish) {
            // if opponent already accepted, then just finish game
            ManagerGame.FlowFinishGame();
            return;
          }
        } else {
          // otherwise, follow script
          this.indicate_finish = false;
          item_locations = proposed_locations;
        }
      }
    }

    if (turn_number >= (ExtraNumTurns + ScriptConcession.length)) {
      Logger.Log('StartTurn error: turn number invalid ' + turn_number);
      return;
    }

    // after simulation
    var wait_time = WaitingTimeTurns[turn_number];
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