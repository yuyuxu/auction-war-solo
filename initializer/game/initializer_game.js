/**
 * This module handles the page title notification
 */
 var PageTitleNotification = {
  original_title: document.title,
  interval: null,

  On: function(notification, interval_speed) {
    var _this = this;
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
  Reset: function(type) {
    if (type == 'disable') {
      $('#accept-div').css('visibility', 'hidden');
    } else {
      is_full_partition = ManagerItem.IsItemSplit();
      if (!is_full_partition) {
        $('#accept-div').css('visibility', 'hidden');
      } else {
        $('#accept-div').css('visibility', 'visible');
        if (ModuleGame.has_opponent_accepted_offer) {
          $('#accept').text('Accept Offer & Finish Game');
        } else {
          $('#accept').text('Accept Offer');
        }
      }
    }

    $('#submit-error').text('');
    $('#game-message').text('');
  },

  EnableDiv: function(name, flag) {
    if (flag) {
      $(name).fadeTo(EffectDefaultTransition, 1);
      $(name).css('pointer-events', 'auto');
    } else {
      $(name).fadeTo(EffectDefaultTransition, 0.3);
      $(name).css('pointer-events', 'none');
    }
  },

  ShowDiv: function(name, flag) {
    if (flag) {
      $(name).css('visibility', 'visible');
    } else {
      $(name).css('visibility', 'hidden');
    }
  },

  // display message
  DisplayMessage: function(message, type) {
    if (ManagerGame.is_game_finished) {
      return;
    }

    if (type == 'game-state') {
      $("#game-state").text(message);
    } else if (type == 'game-message') {
      $("#game-message").text(message);
    }
  },
};

var ManagerController = {
  curr_turn_statement: '',
  curr_turn_action: {},
  action_history: [],

  Init: function() {
    $('#reset').click(function() {
      // reset to previous location
      ManagerItem.ResetLocation();
      ManagerScene.UpdateItemLocation();
      ManagerController.Log('reset', []);
    });

    $('#accept').click(function() {
      // clean up current turn
      ManagerController.Log('accept', []);
      ResetVariables();

      // call player finish turn
      ManagerPlayer[ManagerGame.whose_turn].FinishTurn();
    });

    $('#submit').click(function() {
      // clean up current turn
      var item_moved = ManagerItem.BackupLocation();
      if (item_moved || curr_turn_statement != '') {
        var item_information_str = ManagerItem.ExportItemsInformation();
        ManagerController.Log('submit',
                              [item_information_str, curr_turn_statement]);
      } else {
        $('#submit-error').text('You need to take at least one action. ' +
                                'Please select a valid statement/question, ' +
                                'or/and drag items on the take to ' +
                                'make an offer.');
      }
      ResetVariables();

      // call player finish turn
      ManagerPlayer[ManagerGame.whose_turn].FinishTurn();
    });

    // user actions on the questions and statements
    $('#s3, #s4, #s5, #s6, #s7').click(function() {
      curr_turn_statement = $(this).text();
      $('#selected-statement').css('color', 'green');
      $('#selected-statement').text('You selected: ' + curr_turn_statement);
    });

    $('#q1').click(function() {
      curr_turn_statement = 'Are you interested in ';

      var selected = document.getElementById('q11');
      var select = selected.options[selected.selectedIndex].value;

      if (select == '---') {
        curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least one of items.');
        return;
      }

      curr_turn_statement += select + ' ?';
      $('#selected-statement').css('color', 'green');
      $('#selected-statement').text('You selected: ' + curr_turn_statement);
    });

    $('#s2').click(function() {
      curr_turn_statement = 'I am interested in ';
      var selected = document.getElementById('s21');
      var select = selected.options[selected.selectedIndex].value;
      var selected_attitude = document.getElementById('s22');
      var attitude =
        selected_attitude.options[selected_attitude.selectedIndex].value;

      if (select == '---') {
        curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least ' +
                                      'one item.');
        return;
      }
      if (attitude == '---') {
        curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least one attitude.');
        return;
      }

      curr_turn_statement += select + ' ' + attitude;
      $('#selected-statement').css('color', 'green');
      $('#selected-statement').text('You selected: ' + curr_turn_statement);
    });
  },

  Log: function(action, param) {
    this.curr_turn_action['action'] = action;
    this.curr_turn_action['params'] = param;
    this.curr_turn_action['time'] = GetTimeHMS();
    this.curr_turn_action['player_id'] = ModuleGame.player_id;
    this.curr_turn_action['player_game_name'] = ModuleGame.player_game_name;
    var curr_turn_action_str = JSON.stringify(this.curr_turn_action);
    ManagerController.action_history.push(curr_turn_action_str);
  },

  ResetVariables: function() {
    curr_turn_statement: '',
    curr_turn_action: {},
  }
};

$(document).ready(function() {
  // load page, init game
  window.onload = function() {
    ModuleGame.Init();
  };

  // if focus on this page, turn off page title notification
  $(window).focus(function() {
    PageTitleNotification.Off();
  });

  // leaving page, submit data
  $( "#next-stage" ).click(function() {
    $("#next-stage").closest('form').submit();
  });
});