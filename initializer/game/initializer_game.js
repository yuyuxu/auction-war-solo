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

var ManagerController = {
  curr_turn_statement: '',
  curr_turn_action: {},
  action_history: [],
  Init: function() {
    $('#reset').click(function() {
      ManagerItem.ResetLocation();
      ManagerScene.UpdateItemLocation();
    });
    $('#accept').click(function() {
      ModuleGameController.MediatorActions('accept', []);
    });
    $('#submit').click(function() {
      if (!ModuleGame.is_your_turn) {
        $('#submit-error').text('Wait for your turn');
      } else {
        ManagerItem.BackupLocation();
        if (ManagerItem.has_moved_items || ModuleGameController.curr_turn_statement != '') {
          var items = ManagerItem.ExportItemsInfo();
          ModuleGameController.MediatorActions('submit', [items, ModuleGameController.curr_turn_statement]);
        }
        else {
          $('#submit-error').text('You need to take at least one action. Please select a valid statement/question, or/and drag items on the take to make an offer.');
        }
      }
    });
    $('#s3, #s4, #s5, #s6, #s7').click(function() {
      ModuleGameController.curr_turn_statement = $(this).text();
      $('#selected-statement').css('color', 'green');
      $('#selected-statement').text('You selected: ' + ModuleGameController.curr_turn_statement);
    });
    $('#q1').click(function() {
      ModuleGameController.curr_turn_statement = 'Are you interested in ';
      var selectElement = document.getElementById('q11');
        var select = selectElement.options[selectElement.selectedIndex].value;
      if (select == '---') {
        ModuleGameController.curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least one of items.');
        return;
      }
      ModuleGameController.curr_turn_statement += select + ' ?';
      $('#selected-statement').css('color', 'green');
      $('#selected-statement').text('You selected: ' + ModuleGameController.curr_turn_statement);
    });
    $('#s2').click(function() {
      ModuleGameController.curr_turn_statement = 'I am interested in ';
      var selectElement = document.getElementById('s21');
        var select = selectElement.options[selectElement.selectedIndex].value;
      var attiElement = document.getElementById('s22');
        var attitude = attiElement.options[attiElement.selectedIndex].value;
      if (select == '---') {
        ModuleGameController.curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least one item.');
        return;
      }
      if (attitude == '---') {
        ModuleGameController.curr_turn_statement = '';
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least one attitude.');
        return;
      }
      ModuleGameController.curr_turn_statement += select + ' ' + attitude;
      $('#selected-statement').css('color', 'green');
      $('#selected-statement').text('You selected: ' + ModuleGameController.curr_turn_statement);
    });
  },

  MediatorActions: function(action, param) {
    // history
    this.curr_turn_action['action'] = action;
    this.curr_turn_action['params'] = param;
    this.curr_turn_action['time'] = GetTimeHMS();
    this.curr_turn_action['player_id'] = ModuleGame.player_id;
    this.curr_turn_action['player_game_name'] = ModuleGame.player_game_name;
    var curr_turn_action_str = JSON.stringify(this.curr_turn_action);
    ModuleGameController.action_history.push(curr_turn_action_str);

    // handle action
    var params = {
      player_id: ModuleGame.player_id,
      action_type: action,
      action_params: param
    };
    ModuleGameEventSocket.Trigger('from-client:submit-turn', params);

    // reset turn
    ModuleGameRendering.EnableCompInGame('none');
    ModuleGame.ResetTurn();
    this.ResetInterface('disable');
  },

  ResetInterface: function(type) {
    if (type == 'disable') {
      $('#acceptdiv').css('visibility', 'hidden');
    }
    else {
      is_full_partition = ManagerItem.IsItemSplit();
      if (!is_full_partition)
        $('#acceptdiv').css('visibility', 'hidden');
      else
      {
        $('#acceptdiv').css('visibility', 'visible');
        if (ModuleGame.has_opponent_accepted_offer)
          $('#accept').text('Accept Offer & Finish Game');
        else
          $('#accept').text('Accept Offer');
      }
    }
    $('#submit-error').text('');
    $('#game-message').text('');
  },

  EnableDiv: function(name, flag) {
    if (flag) {
      $(name).fadeTo(EffectDefaultTransition, 1);
      $(name).css('pointer-events', 'auto');
    }
    else {
      $(name).fadeTo(EffectDefaultTransition, 0.3);
      $(name).css('pointer-events', 'none');
    }
  },

  ShowDiv: function(name, flag) {
    if (flag) {
      $(name).css('visibility', 'visible');
    }
    else {
      $(name).css('visibility', 'hidden');
    }
  },

  // display message
  DisplayMessage: function(message, type) {
    if (ManagerGame.game_finished) {
      return;
    }

    if (type == 'game-state') {
      $("#game-state").text(message);
    }
    else if (type == 'game-message') {
      $("#game-message").text(message);
    }
  },
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