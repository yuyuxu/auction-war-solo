// module for questionnaire view model
var VModelQuestionnaire = {
  // view model
  view_model_survey: {
    title: ko.observable(),
    descriptions: ko.observableArray(),
    statements: ko.observable(),
    questions: ko.observableArray(),
    choices: ko.observableArray()
  },

  // creation helper function
  RowQuestion: function() {
    this.question_column = ko.observableArray();
  },

  ColumnQuestion: function(text) {
    this.question_cell_text = text;
  },

  Question: function(data, index) {
    this.question_data = data;
    this.id = ko.observable();
    this.question_row = ko.observableArray();
    this.selected = ko.observable();
    this.count = index;
  },

  Choice: function(text) {
    this.choice_text = text;
  },

  Description: function(data) {
    this.description_image = "";
    this.description_text = "";
    if (data.length > 1) {
      this.description_image = data[1];
    }
    if (data.length > 0) {
      this.description_text = data[0];
    }
  },

  // refer ./data_questionnaire for formats
  LoadModel: function(instrument, answer_list) {
    InitializerUtility.Log("LoadModel: answer is " +
                           JSON.stringify(answer_list));
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
      return new VModelQuestionnaire.Question(data, index);
    });
    for (var i = 0; i < temp.length; ++i) {
      temp[i].id(instrument[0]);
      // for each question, go through its matrix data
      for (var j = 0; j < temp[i].question_data.length; ++j) {
        // row
        var row = new VModelQuestionnaire.RowQuestion();
        for (var k = 0; k < temp[i].question_data[j].length; ++k) {
          // column
          var cell_text = temp[i].question_data[j][k];
          var column = new VModelQuestionnaire.ColumnQuestion(cell_text);
          row.question_column.push(column);
        }
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

  GetAnswers: function() {
    answer_list = [];
    for (var i = 0; i < this.view_model_survey.questions().length; ++i) {
      answer_list.push(this.view_model_survey.questions()[i]['selected']);
    }
    return answer_list;
  }
};
