/** Helper functions for questionnaire page jquery objects. */
var QuestionnairePageHelper = {
  page_id: 1,
  num_question: 6,

  Init: function() {
    // following can make radio button clickable
    // click on table cell will select the radio button included
    $("td").click(function () {
      btn = $(this).find('input:radio');
      btn.attr('checked', true);
    });

    // $('input:radio[name=q1]').change(function() {
    //   Logger.Log($(this).val());
    // });
  },

  GetQuestionnaireData: function() {
    q_data = {};
    for (i = 0; i < this.num_question; i++) {
      v = $('input:radio[name=q' + (i + 1) + ']:checked').val();
      if (v != null) {
        q_data[i] = v;
      }
    }
    return q_data;
  },

  LoadQuestionnaireData: function(qdata) {
    if (qdata == null) {
      return;
    }

    for (i = 0; i < this.num_question; i++) {
      if (qdata[i] != null) {
        var $radios = $('input:radio[name=q' + (i + 1) + ']');
        $radios.filter('[value=' + qdata[i] + ']').prop('checked', true);
      }
    }
  },

  ShowPage: function(page_index) {
    if (page_index == 0) {
      $('#mach').css('display', 'inline');
      $('#svo').css('display', 'none');
    } else {
      $('#mach').css('display', 'none');
      $('#svo').css('display', 'inline');
    }
  }
};

/** Third party wizard component. */
var Wizard = {
  Setup: function() {
    $('#root-wizard').bootstrapWizard({
      'tabClass': 'bwizard-steps',
      'nextSelector': '.button-next',
      'previousSelector': '.button-previous',
      'lastSelector': '.button-finish',

      onNext: function(tab, navigation, index) {
        // this index is the next page index
        // first store data for jquery page
        if ((index - 1) == QuestionnairePageHelper.page_id) {
          QuestionnairePageCache.answers[index - 1] =
            QuestionnairePageHelper.GetQuestionnaireData();
        }
        // check if answer is complete
        if (!QuestionnairePageCache.IsAnswerCompleted(index - 1)) {
          alert('Please fill in all the questions.');
          return false;
        }

        QuestionnairePageHelper.ShowPage(index);
        return true;
      },

      onPrevious: function(tab, navigation, index) {
        // this index is the previous page index
        Logger.Log('onPrevious: index ' + index);
        // first store data for jquery page
        if ((index + 1) == QuestionnairePageHelper.page_id) {
          QuestionnairePageCache.answers[index + 1] =
            QuestionnairePageHelper.GetQuestionnaireData();
        }

        QuestionnairePageHelper.ShowPage(index);
        return true;
      },

      onLast: function(tab, navigation, index) {
        // this index is the current page index
        // first store data for jquery page if needed
        if (index == QuestionnairePageHelper.page_id) {
          QuestionnairePageCache.answers[index] =
            QuestionnairePageHelper.GetQuestionnaireData();
        }
        // check if answer is complete
        if (!QuestionnairePageCache.IsAnswerCompleted(index)) {
          alert('Please fill in all the questions');
          return false;
        } else {
          QuestionnairePageHelper.ShowPage(index);

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
          // using continuous SVO questionnaire, so far directly written into
          // html using jquery object. TODO(@yuyu): Change this to view model.
          QuestionnairePageHelper.LoadQuestionnaireData(
            QuestionnairePageCache.answers[index]);
          QuestionnairePageCache.number_questions[index] =
            QuestionnairePageHelper.num_question;
// QuestionnairePageCache.number_questions[index] =
//   VModelQuestionnaire.LoadModel(index,
//                                 SVOInstrument,
//                                 QuestionnairePageCache.answers[index],
//                                 QuestionnairePageCache.UpdateAnswer);
        } else {
          Logger.Log('Wizard onLast Error: index is ' + index);
        }

        QuestionnairePageHelper.ShowPage(index);
      },

      onTabClick: function(tab, navigation, index) {
        return false;
      }
    });
  }
};

/** Initializer for questionnaire page. */
$(document).ready(function() {
  QuestionnairePageHelper.Init();

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
