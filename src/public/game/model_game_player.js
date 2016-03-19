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

  /** Whether this player wants to finish game. */
  this.indicate_finish = false;

  /** How many turns has current played went through. */
  this.turn_number = -1;
}

/** What player does when turn starts. */
Player.prototype.GetPlayerId = function() {
  return this.player_id;
}


/** What player does when turn starts. */
Player.prototype.StartTurn = function() {
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

    Logger.Log('StartTurn turn number: ' + turn_number + ' player type: ' +
               this.player_type + ' next scripted items: ' +
               JSON.stringify(item_locations) + ' wait time ' + wait_time);

    // after simulation
    ManagerSceneTimer.StartTimer(
      wait_time,
      ManagerSceneTimer.HandlerTickerGameStateMessage,
      ['Wait for your turn '],
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