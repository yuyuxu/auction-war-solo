$(document).ready(function () {
	$('#rootwizard').bootstrapWizard({
		'tabClass': 'bwizard-steps',
		'nextSelector': '.button-next',
		'previousSelector': '.button-previous',
		'lastSelector': '.button-finish',
		onNext: function(tab, navigation, index) {
			var data = ko.toJSON(VModelQuestionnaire.survey_model_view.questions);
			if (!CachePage.IsAnswerCompleted(data))
			{
				bootbox.alert('Please fill in all the questions');
				return false;
			}
			else {
				CachePage.DoCachePage(index - 1, data);
			}
		},
		onPrevious: function(tab, navigation, index) {
			var data = ko.toJSON(VModelQuestionnaire.survey_model_view.questions);
			CachePage.DoCachePage(index + 1, data);
		}, 
		onLast: function(tab, navigation, index) {
			var data = ko.toJSON(VModelQuestionnaire.survey_model_view.questions);
			if (!CachePage.IsAnswerCompleted(data)) {
				bootbox.alert('Please fill in all the questions');
				return false;
			}
			else {
				CachePage.DoCachePage(index, data);
				var answers_str = CachePage.GetAnswersString();
				$('#submit-data').val(answers_str);
				$('.button-finish').closest('form').submit();
			}
		},
		onTabShow: function(tab, navigation, index) {
			var $total = navigation.find('li').length;
			var $current = index + 1;
			var $percent = ($current / $total) * 100;
			$('#rootwizard').find('.bar').css({ width: $percent + '%' });
			if($current >= $total) {
				$('#rootwizard').find('.button-next').hide();
				$('#rootwizard').find('.button-finish').show();
				$('#rootwizard').find('.button-finish').removeClass('disabled');
			} else {
				$('#rootwizard').find('.button-next').show();
				$('#rootwizard').find('.button-finish').hide();
			}

			if (index == 0)	VModelQuestionnaire.LoadModel(machInstrument);
			if (index == 1)	VModelQuestionnaire.LoadModel(svoInstrument);
			var data = ko.toJSON(VModelQuestionnaire.survey_model_view.questions);
			CachePage.DoCachePage(index, data);
			
			var answers_str = $('#submit-data').val();

			CachePage.LoadAnswersString(answers_str);
			CachePage.LoadCachedPage(index);
		}, 
		onTabClick: function(tab, navigation, index) {
			return false;
		}
	});
	window.prettyPrint && prettyPrint();

	// testing framework
	var test_name = $('#test-name').val();
	if (test_name != '') {
		CachePage.is_test = true;
		$('#next-stage').trigger('click');
		$('#next-stage').trigger('click');
	}
}); 