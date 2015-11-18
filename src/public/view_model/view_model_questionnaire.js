// module for questionnaire view model
var VModelQuestionnaire = {
  // view model
  view_model_survey: {
    title: ko.observable(),
    descriptions: ko.observableArray(),
    statements: ko.observable(),
    questions: ko.observableArray(),
    choices: ko.observableArray(),
  },

  // create model helper function
  RowQuestion: function(text) {
    this.question_text = text;
  },

  // catetory: id of the study this question belongs to
  // data: the whole data for one question
  // index: the index of this question among all the questions in the study
  // select_cb: which function to notify if the choice is selected
  Question: function(category, data, index, select_cb) {
    this.category = category;
    this.question_data = data;
    this.question_row = ko.observableArray();
    this.count = index;
    this.selected = ko.observable();
    this.select_cb = select_cb;
    this.Select = function(question, choice) {
      select_cb(question['category'], question['count'], choice['choice_text']);
      return true;
    }
  },

  Choice: function(text) {
    this.choice_text = text;
  },

  Description: function(data) {
    this.description_image = '';
    this.description_text = '';
    if (data.length > 1) {
      this.description_image = data[1];
    }
    if (data.length > 0) {
      this.description_text = data[0];
    }
  },

  // refer ./data_questionnaire for formats
  LoadModel: function(instrument_index, instrument, answer_list, select_cb) {
    // title
    this.view_model_survey.title(instrument[0]);

    // description
    this.view_model_survey.descriptions.removeAll();
    var temp = $.map(instrument[1], function(data) {
      return new VModelQuestionnaire.Description(data);
    });
    for (var i = 0; i < temp.length; ++i) {
      this.view_model_survey.descriptions.push(temp[i]);
    }

    // statement
    this.view_model_survey.statements(instrument[2]);

    // questions
    this.view_model_survey.questions.removeAll();
    var temp = $.map(instrument[3], function(data, index) {
      return new VModelQuestionnaire.Question(instrument_index,
                                              data,
                                              index,
                                              select_cb);
    });
    for (var i = 0; i < temp.length; ++i) {
      // for each question, go through its row of data
      for (var j = 0; j < temp[i].question_data.length; ++j) {
        // row
        var row = new VModelQuestionnaire.RowQuestion(temp[i].question_data[j]);
        temp[i].question_row.push(row);
      }
      // set answer if existing
      if (answer_list != null) {
        temp[i]['selected'] = answer_list[i];
      }
      // push into view model
      this.view_model_survey.questions.push(temp[i]);
    }

    // choice text
    this.view_model_survey.choices.removeAll();
    var temp = $.map(instrument[4], function(text) {
      return new VModelQuestionnaire.Choice(text);
    });
    for (var i = 0; i < temp.length; ++i) {
      this.view_model_survey.choices.push(temp[i]);
    }
  },
};
