$(document).ready(function () {
	var playerside = $('#player-side').val();
	$('#' + playerside).css('display', 'initial');

	var playerid = $('#player-id').val();
	window.onbeforeunload = function () {
		// window.alert('Are you sure you want to leave or refresh the page?');
		NotifyInactive(playerid, 'introduction');
	};

	$('#prevstage').click(function () {
		window.onbeforeunload = null;
		bootbox.confirm('You might be assigned with a different character if you go back to previous stage. Press OK to confirm.', function(result) {
		  if (result) $('#prevstage').closest('form').submit();
		}); 
	});
	$('#nextstage').click(function () {
		window.onbeforeunload = null;
		$('#nextstage').closest('form').submit();
	});
	$('#prevstage1').click(function() {
		window.onbeforeunload = null;
		bootbox.confirm('You might be assigned with a different character if you go back to previous stage. Press OK to confirm.', function(result) {
			if (result) $('#prevstage1').closest('form').submit();
		});
	});
	$('#nextstage1').click(function () {
		window.onbeforeunload = null;
		$('#nextstage1').closest('form').submit();
	});
	$('#prevstage2').click(function () {
		window.onbeforeunload = null;
		bootbox.confirm('You might be assigned with a different character if you go back to previous stage. Press OK to confirm.', function(result) {
			if (result) $('#prevstage2').closest('form').submit();
		});
	});
	$('#nextstage2').click(function () {
		window.onbeforeunload = null;
		$('#nextstage2').closest('form').submit();
	});


	var test_name = $('#test-name').val();
	if (test_name != '') {
		if (playerside == 'Sam-0')	$('#nextstage').trigger('click');
		if (playerside == 'Alex-0')	$('#nextstage1').trigger('click');
		if (playerside == 'Alex-1')	$('#nextstage2').trigger('click');
	}
}); 