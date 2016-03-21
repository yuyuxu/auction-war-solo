/** Model (static, front end, game) that manages all the controller components.
 * Specifically, controllers include game page and game scene controller.
 */
var ManagerController = {
  /** Current statement.
   * @type {string}
   */
  curr_statement: '',

  /** Log actions taken. These recorded action will be upload to database.
   * @type {Array.Object}
   */
  log_actions: [],

  /** API. Set current statement.
   * @param {string} statement - statement to set.
   */
  SetCurrentStatement: function(statement) {
    this.curr_statement = statement;
  },

  /** API. Main entrance for taking one action.
   * @param {string} type - type of the controller that sends the action.
   * @param {string} action - type of the action itself.
   * @param {Object} params - params that comes along with the action.
   */
  TakeAction: function(type, action, params) {
    if (type == 'page') {
      if (action == 'accept') {
        ManagerGame.GetCurrentPlayer().indicate_finish = true;

        // page button accept clicked
        if (ManagerGame.GetNextPlayer().indicate_finish) {
          ManagerGame.FlowFinishGame();
          return;
        }

        // clean up current turn
        this.Log('accept', []);
        this.ResetVariables();

        // call player finish turn
        var current_player = ManagerGame.GetCurrentPlayer();
        if (current_player != null) {
          current_player.FinishTurn(
            [ManagerSceneItem.ExportItemLocations(),
             this.curr_turn_statement]);
        }
      } else if (action == 'submit') {
        ManagerScene.MoveNeutralItems();
        this.Log('submit', [ManagerSceneItem.ExportItemLocations(),
                            this.curr_turn_statement]);

        this.ResetVariables();

        // call player finish turn
        var current_player = ManagerGame.GetCurrentPlayer();
        if (current_player != null) {
          current_player.FinishTurn(
            [ManagerSceneItem.ExportItemLocations(),
             this.curr_turn_statement]);
        }
      } else {
        Logger.Log('TakeAction warning: action ' + action + 'not supported.');
      }
    }
  },

  /** API. Logging the actions
   * @param {string} action - type of the action itself.
   * @param {Object} params - params that comes along with the action.
   */
  Log: function(action, params) {
    var curr_turn_action = {};
    // curr_turn_action['player_id'] =
    //   ManagerGame.GetCurrentPlayer().player_id;
    // curr_turn_action['time'] = Logger.GetFullTime();
    curr_turn_action['action'] = action;
    curr_turn_action['params'] = params;
    var action_str = JSON.stringify(curr_turn_action);
    this.log_actions.push(action_str);
  },

  /** API. Rest the parameters. */
  ResetVariables: function() {
    this.curr_turn_statement = '';
  },
};