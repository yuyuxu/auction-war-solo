/** Initializer for introduction page. */
$(document).ready(function() {
  // enable the section according the type of the role
  var player_role = $('#player-role').val();
  $('#' + player_role).css('display', 'initial');
  Logger.Log('loading introduction page... ');
  Logger.Log('player_role is: ' + player_role);

  // setup stage transition
  $('#prev-stage').click(function () {
    $('#prev-stage').closest('form').submit();
  });

  $('#next-stage').click(function () {
    $('#next-stage').closest('form').submit();
  });
});