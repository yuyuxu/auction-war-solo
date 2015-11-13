/**
 * This module handles the page title notification
 */
 var PageTitleNotification = {
  original_title: document.title,
  interval: null,

  On: function(notification, interval_speed) {
    var _this = this;
    _this.Off();
    _this.interval = setInterval(function() {
       document.title = (_this.original_title == document.title) ?
                        notification : _this.original_title;
    }, (interval_speed) ? interval_speed : 1000);
  },

  Off: function() {
    clearInterval(this.interval);
    document.title = this.original_title;
  }
}

var GamePageHelper = {
  Reset: function() {
    if (ManagerPlayer.PlayersFinished()) {
      $('#accept').text('Accept Offer & Finish Game');
      $('#accept-comment1').css('display', 'none');
      $('#accept-comment2').css('display', 'inline');
    } else {
      $('#accept').text('Accept Offer');
      $('#accept-comment1').css('display', 'inline');
      $('#accept-comment2').css('display', 'none');
    }
    this.ShowDiv('#accept-div', true);
    $('#submit-error').text('');
    $('#game-message').text('');
  },

  DisplayDiv: function(name, flag) {
    if (flag) {
      $(name).css('display', 'inline');
    } else {
      $(name).css('display', 'none');
    }
  },

  ShowDiv: function(name, flag) {
    if (flag) {
      $(name).css('visibility', 'visible');
    } else {
      $(name).css('visibility', 'hidden');
    }
  },

  DisplayMessage: function(type, message) {
    if (ManagerGame.is_game_finished) {
      return;
    }

    if (type == 'game-state') {
      $('#game-state').text(message);
    } else if (type == 'game-message') {
      $('#game-message').text(message);
    }
  },
};

var ManagerController = {
  curr_turn_statement: '',
  curr_turn_action: {},
  action_history: [],

  Init: function() {
    // all bellwo has lost of binding problem
    $('#reset').click(function() {
      // reset to previous location
      ManagerSceneItem.ResetLocation();
      ManagerScene.UpdateItemLocation();
      ManagerController.Log('reset', []);
    });

    $('#accept').click(function() {
      if (ManagerPlayer.PlayersFinished()) {
        ManagerGame.FlowFinishGame();
        return;
      }

      // clean up current turn
      ManagerController.Log('accept', []);
      ManagerController.ResetVariables();

      // call player finish turn
      var current_player = ManagerGame.GetCurrentPlayer();
      if (current_player != null) {
        current_player.indicate_finish = true;
        current_player.FinishTurn(
          [ManagerSceneItem.ExportItemLocations(),
           ManagerController.curr_turn_statement]);
      }
    });

    $('#submit').click(function() {
      // clean up current turn
      GamePageHelper.ShowDiv('#accept-div', false);

      var item_moved = ManagerSceneItem.BackupLocation();
      if (item_moved || ManagerController.curr_turn_statement != '') {
        var item_information_str = ManagerSceneItem.ExportItemLocations();
        ManagerScene.MoveNeutralItems();
        ManagerController.Log('submit',
                              [item_information_str,
                               ManagerController.curr_turn_statement]);
      } else {
        $('#submit-error').text('You need to take at least one action. ' +
                                'Please select a valid statement/question, ' +
                                'or/and drag items on the take to ' +
                                'make an offer.');
      }
      ManagerController.ResetVariables();

      // call player finish turn
      InitializerUtility.Log('submit turn: ' + ManagerGame.whose_turn);
      var current_player = ManagerGame.GetCurrentPlayer();
      if (current_player != null) {
        current_player.indicate_finish = false;
        current_player.FinishTurn(
          [ManagerSceneItem.ExportItemLocations(),
           ManagerController.curr_turn_statement]);
      }
    });

    // user actions on the questions and statements
    $('#s3, #s4, #s5, #s6, #s7').click(function() {
      ManagerController.curr_turn_statement = $(this).text();
      $('#selected-statement').css('color', 'blue');
      $('#selected-statement').text('You selected: ' +
                                    ManagerController.curr_turn_statement);
    });

    $('#q1').click(function() {
      ManagerController.curr_turn_statement = 'Are you interested in ';

      var selected = document.getElementById('q11');
      var select = selected.options[selected.selectedIndex].value;

      if (select == '---') {
        ManagerController.curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least one of items.');
        return;
      }

      ManagerController.curr_turn_statement += select + ' ?';
      $('#selected-statement').css('color', 'blue');
      $('#selected-statement').text('You selected: ' +
                                    ManagerController.curr_turn_statement);
    });

    $('#s2').click(function() {
      ManagerController.curr_turn_statement = 'I am interested in ';
      var selected = document.getElementById('s21');
      var select = selected.options[selected.selectedIndex].value;
      var selected_attitude = document.getElementById('s22');
      var attitude =
        selected_attitude.options[selected_attitude.selectedIndex].value;

      if (select == '---') {
        ManagerController.curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least ' +
                                      'one item.');
        return;
      }
      if (attitude == '---') {
        ManagerController.curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least ' +
                                      'one attitude.');
        return;
      }

      ManagerController.curr_turn_statement += select + ' ' + attitude;
      $('#selected-statement').css('color', 'blue');
      $('#selected-statement').text('You selected: ' +
                                    ManagerController.curr_turn_statement);
    });
  },

  Log: function(action, param) {
    ManagerController.curr_turn_action['player_id'] = ManagerGame.player_id;
    ManagerController.curr_turn_action['time'] =
      InitializerUtility.GetFullTime();
    ManagerController.curr_turn_action['action'] = action;
    ManagerController.curr_turn_action['params'] = param;
    var action_str = JSON.stringify(ManagerController.curr_turn_action);
    ManagerController.action_history.push(action_str);
  },

  ResetVariables: function() {
    ManagerController.curr_turn_statement = '';
    ManagerController.curr_turn_action = {};
  }
};

$(document).ready(function() {
  // load page, init game
  window.onload = function() {
    ManagerGame.Init($('#player-id').val(), HumanVsScripted);
  };

  // if focus on this page, turn off page title notification
  $(window).focus(function() {
    PageTitleNotification.Off();
  });

  // leaving page, submit data
  $('#next-stage').click(function() {
    $('submit-data').val(
      JSON.stringify(ManagerSceneItem.ExportItemsInformation));
    $('#next-stage').closest('form').submit();
  });
});