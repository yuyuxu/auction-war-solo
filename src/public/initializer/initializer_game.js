/** Render function involving game page jquery objects. */
var ViewGamePage = {
  /** Reset all the jquery objects according to if it's player's turn.
   * @param {boolean} active - if it's player's turn.
   * @param {boolean} accepted - whether the other player's accepted offer.
   */
  Reset: function(active, accepted) {
    if (accepted) {
      // if the other player has accepted the offer
      $('#accept').text('Accept Offer & Finish Game');
      $('#accept-comment1').css('display', 'none');
      $('#accept-comment2').css('display', 'inline');
    } else {
      $('#accept').text('Accept Offer');
      $('#accept-comment1').css('display', 'inline');
      $('#accept-comment2').css('display', 'none');
    }

    if (active) {
      this.ShowDiv('#accept-div', true);
      this.ShowDiv('#submit-div', true);
      $('#submit').removeClass('active').addClass('disabled');
    } else {
      this.ShowDiv('#accept-div', false);
      this.ShowDiv('#submit-div', false);
      $('#submit').removeClass('active').addClass('disabled');
    }

    $('#submit-error').text('');
    $('#game-message').text('');
  },

  /** Display message using some jquery objects.
   * @param {string} name - name of jquery object with # etc..
   * @param {boolean} flag - game finished flag which impact whether to display.
   * @param {string} message - what to display.
   */
  DisplayMessage: function(name, message) {
    $(name).text(message);
  },

  /** Display jquery div object.
   * @param {string} name - name of jquery object with # etc..
   * @param {boolean} flag - whether to display div.
   */
  DisplayDiv: function(name, flag) {
    if (flag) {
      $(name).css('display', 'inline');
    } else {
      $(name).css('display', 'none');
    }
  },

  /** Show/Hide jquery div object.
   * @param {string} name - name of jquery object with # etc..
   * @param {boolean} flag - whether to show div.
   */
  ShowDiv: function(name, flag) {
    if (flag) {
      $(name).css('visibility', 'visible');
    } else {
      $(name).css('visibility', 'hidden');
    }
  },

  /** Enable/Disable jquery div object.
   * @param {string} name - name of jquery object with # etc..
   * @param {boolean} flag - whether to disable div.
   */
  DisableDiv: function(name, flag) {
    $(name).prop('disabled', flag);
  },
};

/** Controller function involving game page jquery objects.
 * It should only interact with ManagerController model.
 */
var ControllerGamePage = {
  Init: function() {
    // all bellow code has lost of binding problem
    $('#reset').click(function() {
      ManagerController.TakeAction('page', 'reset', null);
    });

    $('#accept').click(function() {
      ManagerController.TakeAction('page', 'accept', null);
    });

    $('#submit').click(function() {
      ManagerController.TakeAction('page', 'submit', null);
    });

    $('#s3, #s4, #s5, #s6, #s7').click(function() {
      var statement = $(this).text();
      ManagerController.SetCurrentStatement(statement);
      $('#selected-statement').css('color', 'blue');
      $('#selected-statement').text('You selected: ' + statement);
    });

    $('#q1').click(function() {
      var statement = 'Are you interested in ';
      var selected = document.getElementById('q11');
      var select = selected.options[selected.selectedIndex].value;
      if (select == '---') {
        statement = '';
        ManagerController.SetCurrentStatement(statement);
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least ... ' +
                                      'one of items.');
      } else {
        statement += select + ' ?';
        ManagerController.SetCurrentStatement(statement);
        $('#selected-statement').css('color', 'blue');
        $('#selected-statement').text('You selected: ' + statement);
      }
    });

    $('#s2').click(function() {
      var statement = 'I am interested in ';
      var selected = document.getElementById('s21');
      var select = selected.options[selected.selectedIndex].value;
      var selected_attitude = document.getElementById('s22');
      var attitude =
        selected_attitude.options[selected_attitude.selectedIndex].value;
      if (select == '---') {
        statement = '';
        ManagerController.SetCurrentStatement(statement);
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least ' +
                                      'one item.');
      } else if (attitude == '---') {
        statement = '';
        ManagerController.SetCurrentStatement(statement);
        $('#selected-statement').css('color', 'red');
        $('#selected-statement').text('Warning: Please select at least ' +
                                      'one attitude.');
      } else {
        statement += select + ' ' + attitude;
        ManagerController.SetCurrentStatement(statement);
        $('#selected-statement').css('color', 'blue');
        $('#selected-statement').text('You selected: ' + statement);
      }
    });
  },
};

/** Initializer for game page. */
$(document).ready(function() {
  // load page, init game
  window.onload = function() {
    // init game components
    ManagerGame.Init($('#player-id').val(), HumanVsScripted);
    // init game interface
    canvas_obj = document.getElementById('game-canvas');
    $(window).resize(this.UpdateCanvas);
    document.onkeydown = this.HandleKeyDown;
  };

  // if focus on this page, turn off page title notification
  $(window).focus(function() {
    PageTitleNotification.Off();
  });

  // setup transition between stages
  $('#next-stage').click(function() {
    $('#next-stage').closest('form').submit();
  });
});
