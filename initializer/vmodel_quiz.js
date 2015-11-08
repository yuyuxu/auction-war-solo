$(document).ready(function() {
	var playerid = $('#player-id').val();
	window.onbeforeunload = function () {
		// alert('Are you sure you want to leave or refresh the page? If you refresh this page, you will be redirected to the starting page...');
		NotifyInactive(playerid, 'quiz');
	};

	$( '#prevstage' ).click(function() {
		window.onbeforeunload = null;
		var to_submit = VModelQuiz.GetSubmitData();
		$('#prevstage').closest('form').submit();
	});
	$( '#nextstage' ).click(function() {
		window.onbeforeunload = null;
		var to_submit = VModelQuiz.GetSubmitData();
		if (VModelQuiz.IsSubmitDataValid()) {
			$('#nextstage').closest('form').submit();
		}
		else {
			bootbox.alert('Answer is not correct, please read instructions carefully.');
		}
	});
	
	qdata = $('#quiz-data_prev').val();
	if (qdata != null && qdata != '*' && qdata != '') {
		submitdata = JSON.parse(qdata);
		VModelQuiz.SetSubmitData(submitdata);
	}

	var test_name = $('#test-name').val();
	if (test_name != '') {
		VModelQuiz.is_test = true;
		$('#nextstage').trigger('click');
	}
});