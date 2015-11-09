// questionnaire page cache module
var QuestionnairePageCache = {
  // answers, {page_number: [list of answers]}
  answers: {},

  /**
   * @param {ko object} data - the question object from ko view model
   */
  DoCacheAnswer: function(page_number) {
    // get answer from view model
    var answer_list = VModelQuestionnaire.GetAnswers();
    // cache answer
    this.answers[page_number] = answer_list;
  },

  IsAnswerCompleted: function(page_number) {
    if (this.answers[page_number] == null) {
      InitializerUtility.Log('IsAnswerCompleted warning: no answers cached');
      return;
    }
    for (var i = 0; i < this.answers[page_number].length; ++i) {
      if (this.answers[page_number][i] == null) {
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
    $('#rootwizard').bootstrapWizard({
      'tabClass': 'bwizard-steps',
      'nextSelector': '.button-next',
      'previousSelector': '.button-previous',
      'lastSelector': '.button-finish',

      onNext: function(tab, navigation, index) {
        // cache the answers'
        QuestionnairePageCache.DoCacheAnswer(index - 1);
        InitializerUtility.Log('current answer: ' +
                               QuestionnairePageCache.GetAnswersString());
        if (!QuestionnairePageCache.IsAnswerCompleted(index - 1)) {
          bootbox.alert('Please fill in all the questions.');
          return false;
        }
      },

      onPrevious: function(tab, navigation, index) {
        // cache the answers
        QuestionnairePageCache.DoCacheAnswer(index + 1);
        InitializerUtility.Log('current answer: ' +
                               QuestionnairePageCache.GetAnswersString());
      },

      onLast: function(tab, navigation, index) {
        // cache the answers
        InitializerUtility.Log('Wizard onLast current index is: ' + index);
        QuestionnairePageCache.DoCacheAnswer(index + 1,
          VModelQuestionnaire.view_model_survey.questions);

        if (!QuestionnairePageCache.IsAnswerCompleted(index)) {
          bootbox.alert('Please fill in all the questions');
          return false;
        } else {
          // submit data if it's last page as well
          var answers_str = QuestionnairePageCache.GetAnswersString();
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
        $('#rootwizard').find('.bar').css({width: $percent + '%'});
        if ($current >= $total) {
          $('#rootwizard').find('.button-next').hide();
          $('#rootwizard').find('.button-finish').show();
          $('#rootwizard').find('.button-finish').removeClass('disabled');
        } else {
          $('#rootwizard').find('.button-next').show();
          $('#rootwizard').find('.button-finish').hide();
        }

        InitializerUtility.Log('Wizard onTabShow current index is: ' + index);
        // load instrument and answer
        if (index == 0) {
          VModelQuestionnaire.LoadModel(MachInstrument,
                                        QuestionnairePageCache.answers[index]);
        } else if (index == 1) {
          VModelQuestionnaire.LoadModel(SVOInstrument,
                                        QuestionnairePageCache.answers[index]);
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

// intialize page
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