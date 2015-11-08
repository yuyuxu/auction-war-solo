var VModelQuestionnaire = {
	survey_model_view : {
		title: ko.observable(),
		descriptions: ko.observableArray(),
		statement: ko.observable(),
		questions: ko.observableArray(),
		availableChoices: ko.observableArray()
	},

	RowQuestions : function (text) {
		this.questionColumn = ko.observableArray();
	},

	ColumnQuestions : function (text) {
		this.questionCellText = text[0];
	},

	Question : function (text, index) {
		this.questionText = text; 
		this.questionRow = ko.observableArray(); 
		this.selected = ko.observable(); 
		this.id = ko.observable(); 
		this.count = index; 		
	},

	Choice : function (text) {
		this.choiceText = text;
	},

	Description : function (text) {
		this.descImage = ""; 
		this.descText = "";
		if (text.length > 1) {
			this.descImage = text[1]; 
		}
		if (text.length > 0) {
			this.descText = text[0];
		}		
	},

	LoadModel : function (instrument) {
		// title
		this.survey_model_view.title(instrument[0]);
		// description
		var tempD = $.map(instrument[1], function (text, index) {
			return new VModelQuestionnaire.Description(text);
		});
		this.survey_model_view.descriptions.removeAll();
		for (var i = 0; i < tempD.length; ++i)
			this.survey_model_view.descriptions.push(tempD[i]);
		// statements
		this.survey_model_view.statement(instrument[2]);
		// questions
		this.survey_model_view.questions.removeAll();
		var tempQ = $.map(instrument[3], function (text, index) { 
			return new VModelQuestionnaire.Question(text, index);
		});
		for (var i = 0; i < tempQ.length; ++i)
		{
			tempQ[i].id(instrument[0]);
			for (var j = 0; j < tempQ[i].questionText.length; ++j)
			{
				var rq = new VModelQuestionnaire.RowQuestions();
				for (var k = 0; k < tempQ[i].questionText[j].length; ++k)
				{
					var cellText = tempQ[i].questionText[j][k];
					var cq = new VModelQuestionnaire.ColumnQuestions(cellText);
					rq.questionColumn.push(cq);
				}
				tempQ[i].questionRow.push(rq);
			}
			this.survey_model_view.questions.push(tempQ[i]);
		}
		// choices
		this.survey_model_view.availableChoices.removeAll();
		var tempC = $.map(instrument[4], function(text) { 
			return new VModelQuestionnaire.Choice(text);
		});
		for (var i = 0; i < tempC.length; ++i)
		{
			this.survey_model_view.availableChoices.push(tempC[i]);
		}
	}
};
ko.applyBindings(VModelQuestionnaire.survey_model_view);

var CachePage = {
	page_data : {},
	answers : {},
	is_test : false,

	DoCachePage : function (page_number, data) {
		this.page_data[page_number] = data;

		this.answers[page_number] = [];
		var objs = JSON.parse(data);
		for (var i = 0; i < objs.length; ++i) {
			this.answers[page_number].push(objs[i]["selected"]);
		}
	},

	HasCachedPage : function (page_number) {
		if (this.page_data[page_number] == null) {
			return false;
		}
		return true;		
	},

	LoadCachedPage : function (page_number) {
		VModelQuestionnaire.survey_model_view.questions.removeAll();

		var temp_data = JSON.parse(this.page_data[page_number]);
		for (var i = 0; i < temp_data.length; ++i)
		{
			if (this.answers[page_number] != null)
			{
				temp_data[i]["selected"] = this.answers[page_number][i];
			}
			VModelQuestionnaire.survey_model_view.questions.push(temp_data[i]);
		}
	},

	HasAnswer : function (page_number) {
		if (this.answers[page_number] == null) {
			return false;
		}
		return true;		
	},

	IsAnswerCompleted : function (page_data) {
		if (this.is_test) return true;

		var temp_data = JSON.parse(page_data);
		for (var i = 0; i < temp_data.length; ++i)
		{
			if (temp_data[i]["selected"] == null) {
				return false;
			}
		}
		return true;
	},

	GetAnswersString : function () {
		var answers_str = JSON.stringify(this.answers);
		return answers_str;
	},

	LoadAnswersString : function (answers_str) {
		if (answers_str != null && answers_str != '*' && answers_str != '')  {
			var answerlist = JSON.parse(answers_str);
			for (var key in answerlist) {
				this.answers[key] = [];
				var alist = answerlist[key];
				for (var i = 0; i < alist.length; i++) {
					this.answers[key].push(alist[i]);
				}
			}
		}
	}

};