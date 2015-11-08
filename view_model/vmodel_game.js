$(document).ready(function () {

	window.onload = function () {
		ModuleGame.Init();
	};	

	var playerid = $('#player-id').val();
	window.onbeforeunload = function () {
		// alert('Are you sure you want to leave or refresh the page? If you refresh this page, you will be redirected to the starting page...');
		NotifyInactive(playerid, 'game');
	};

	$(window).focus(function() {
    	PageTitleNotification.Off();
	});

	$( "#nextstage" ).click(function () {
		window.onbeforeunload = null;
		$("#nextstage").closest('form').submit();
	});

	var test_name = $('#test-name').val();
	if (test_name != '') {
		ModuleGame.is_testing = true;
	}
});