// questionnaire page cache module
var QuestionnairePageCache = {
  // answers, {page_id: {answer_index: answer_value}}
  answers: {},

  UpdateAnswer: function(page_id, answer_index, answer_value) {
    // notice here QuestionnairePageCache is used instead of this
    // because UpdateAnwser is used as a reference for callback function
    // inside VModelQuestionnaire, therefore 'this' binding is lost
    if (QuestionnairePageCache.answers[page_id] == null) {
      QuestionnairePageCache.answers[page_id] = {};
    }
    QuestionnairePageCache.answers[page_id][answer_index] = answer_value;
  },

  IsAnswerCompleted: function(page_id) {
    return true;
    if (this.answers[page_id] == null) {
      InitializerUtility.Log('IsAnswerCompleted warning: no answers cached');
      return;
    }
    for (var i = 0; i < this.answers[page_id].length; ++i) {
      if (this.answers[page_id][i] == null) {
        return false;
      }
    }
    return true;
  },

  GetAnswersString: function() {
    var answers_str = JSON.stringify(this.answers);
    return answers_str;
  },
};

// wizard module
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
          InitializerUtility.Log('submit data: ' + answers_str);
          $('#submit-data').val(answers_str);
          $('.button-finish').closest('form').submit();
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
          VModelQuestionnaire.LoadModel(index,
                                        MachInstrument,
                                        QuestionnairePageCache.answers[index],
                                        QuestionnairePageCache.UpdateAnswer);
        } else if (index == 1) {
          VModelQuestionnaire.LoadModel(index,
                                        SVOInstrument,
                                        QuestionnairePageCache.answers[index],
                                        QuestionnairePageCache.UpdateAnswer);
        } else {
          InitializerUtility.Log('Wizard onLast Error: index is ' + index);
        }
      },

      onTabClick: function(tab, navigation, index) {
        return false;
      }
    });
  }
};

// initialize page
$(document).ready(function() {
  // wizard
  Wizard.Setup();
  window.prettyPrint && prettyPrint();

  // click on the radio button
  $('#input_choice').click(function() {
    $('#input_choice').hide();
  });

  // view model
  ko.applyBindings(VModelQuestionnaire.view_model_survey);
});