/** Model (static, front end, game) that manages all the controller components.
 * Specifically, controllers include game page and game scene controller.
 */
var ManagerController = {
  /** Current statement.
   * @type {string}
   */
  curr_statement: '',

  /** Log all the action taken.
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
      if (action == 'reset') {
        // page button reset clicked
        // todo
        ManagerView.Reset('game');
      } else if (action == 'accept') {
        // page button accept clicked
        // todo
        if (ManagerPlayer.PlayersFinished()) {
          ManagerGame.FlowFinishGame();
          return;
        }

        // clean up current turn
        ControllerGamePage.Log('accept', []);
        ControllerGamePage.ResetVariables();

        // call player finish turn
        var current_player = ManagerGame.GetCurrentPlayer();
        if (current_player != null) {
          current_player.indicate_finish = true;
          current_player.FinishTurn(
            [ManagerSceneItem.ExportItemLocations(),
             ControllerGamePage.curr_turn_statement]);
        }
      } else if (action == 'submit') {
        // page button submit clicked
        // todo
        ViewGamePage.ShowDiv('#accept-div', false);

        var item_moved = ManagerSceneItem.BackupLocation();
        if (item_moved || ControllerGamePage.curr_turn_statement != '') {
          var item_information_str = ManagerSceneItem.ExportItemLocations();
          ManagerScene.MoveNeutralItems();
          ControllerGamePage.Log('submit',
                                [item_information_str,
                                 ControllerGamePage.curr_turn_statement]);
        } else {
          $('#submit-error').text('You need to take at least one action. ' +
                                  'Please select a valid statement/question, ' +
                                  'or/and drag items on the take to ' +
                                  'make an offer.');
        }
        ControllerGamePage.ResetVariables();

        // call player finish turn
        Logger.Log('submit turn: ' + ManagerGame.whose_turn);
        var current_player = ManagerGame.GetCurrentPlayer();
        if (current_player != null) {
          current_player.indicate_finish = false;
          current_player.FinishTurn(
            [ManagerSceneItem.ExportItemLocations(),
             ControllerGamePage.curr_turn_statement]);
        }
      }
    }
  }

  /** API. Logging the actions
   * @param {string} action - type of the action itself.
   * @param {Object} params - params that comes along with the action.
   */
  Log: function(action, params) {
    ControllerGamePage.curr_turn_action['player_id'] = ManagerGame.player_id;
    ControllerGamePage.curr_turn_action['time'] =
      Logger.GetFullTime();
    ControllerGamePage.curr_turn_action['action'] = action;
    ControllerGamePage.curr_turn_action['params'] = params;
    var action_str = JSON.stringify(ControllerGamePage.curr_turn_action);
    ControllerGamePage.action_history.push(action_str);
  },

  /** API. Rest the parameters. */
  Reset: function() {
    this.curr_turn_statement = '';
  },
};