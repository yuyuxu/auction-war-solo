/** Third party wizard component. */
var Wizard = {
  Setup: function() {
    $('#root-wizard').bootstrapWizard({
      'tabClass': 'bwizard-steps',
      'nextSelector': '.button-next',
      'previousSelector': '.button-previous',
      'lastSelector': '.button-finish',

      onNext: function(tab, navigation, index) {
        // check if answer is complete
        if (!QuestionnairePageCache.IsAnswerCompleted(index - 1)) {
          alert('Please fill in all the questions.');
          return false;
        }
      },

      onPrevious: function(tab, navigation, index) {
        return true;
      },

      onLast: function(tab, navigation, index) {
        // check if answer is complete
        if (!QuestionnairePageCache.IsAnswerCompleted(index)) {
          alert('Please fill in all the questions');
          return false;
        } else {
          // submit data
          var answers_str = QuestionnairePageCache.GetAnswersString();
          Logger.Log('submit data: ' + answers_str);
          $('#submit-data').val(answers_str);
          $('#submit-form').submit();
        }
      },

      onTabShow: function(tab, navigation, index) {
        // compute the percentage of current wizard progress,
        // which will decide whether to show finish button
        var $total = navigation.find('li').length;
        var $current = index + 1;
        var $percent = ($current / $total) * 100;
        $('#root-wizard').find('.bar').css({width: $percent + '%'});
        if ($current >= $total) {
          $('#root-wizard').find('.button-next').hide();
          $('#root-wizard').find('.button-finish').show();
          $('#root-wizard').find('.button-finish').removeClass('disabled');
        } else {
          $('#root-wizard').find('.button-next').show();
          $('#root-wizard').find('.button-finish').hide();
        }

        // load instrument and answer
        if (index == 0) {
          QuestionnairePageCache.number_questions[index] =
            VModelQuestionnaire.LoadModel(index,
                                          MachInstrument,
                                          QuestionnairePageCache.answers[index],
                                          QuestionnairePageCache.UpdateAnswer);

        } else if (index == 1) {
          QuestionnairePageCache.number_questions[index] =
            VModelQuestionnaire.LoadModel(index,
                                          SVOInstrument,
                                          QuestionnairePageCache.answers[index],
                                          QuestionnairePageCache.UpdateAnswer);
        } else {
          Logger.Log('Wizard onLast Error: index is ' + index);
        }
      },

      onTabClick: function(tab, navigation, index) {
        return false;
      }
    });
  }
};

/** Initializer for questionnaire page. */
$(document).ready(function() {
  // if database does contain data of this user_id, load it into answer
  // *notice here this has to happen before the wizard and view model is setup*
  // before wizard because wizard will somehow wash away '#submit-data'
  // before view_model because '#submit-data' is needed for view_model
  var answers_str = $('#submit-data').val();
  Logger.Log('loading questionnaire page...');
  Logger.Log('answer is: ' + answers_str);
  QuestionnairePageCache.SetAnswersString(answers_str);

  // wizard
  Wizard.Setup();
  window.prettyPrint && prettyPrint();

  // view model
  ko.applyBindings(VModelQuestionnaire.view_model_survey);
});
