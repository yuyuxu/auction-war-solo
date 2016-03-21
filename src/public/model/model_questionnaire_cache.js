/** Model (static, front end) for questionnaire page cache. */
var QuestionnairePageCache = {
  /** Answer cache.
   * @type {Object<int, Object<int, string> >}
   * {page_id: {answer_index: answer_value}}
   */
  answers: {},

  /** Actually length of questions
   * @type {Object<int, int>}
   * {page_id: number_questions}
   */
  number_questions: {},

  /** API. Update answers.
   * @param {integer} page_id - page number.
   * @param {integer} answer_index - page number.
   * @param {string} answer_value - the value of the checked radio.
   */
  UpdateAnswer: function(page_id, answer_index, answer_value) {
    // binding lost
    if (QuestionnairePageCache.answers[page_id] == null) {
      QuestionnairePageCache.answers[page_id] = {};
    }
    QuestionnairePageCache.answers[page_id][answer_index] = answer_value;
  },

  /** API. Check if the answers are completely.
   * @param {integer} page_id - page number.
   */
  IsAnswerCompleted: function(page_id) {
    // TEST, uncomment
    // return true;

    if (this.answers[page_id] == null) {
      Logger.Log('IsAnswerCompleted warning: no answers cached');
      return false;
    }
    for (var i = 0; i < this.number_questions[page_id]; ++i) {
      if (this.answers[page_id][i] == null) {
        return false;
      }
    }
    return true;
  },

  /** API. Get all the answers in a string format. */
  GetAnswersString: function() {
    var answers_str = JSON.stringify(this.answers);
    return answers_str;
  },

  /** API. Set answers given string.
   * @param {string} answers_str - string containing JSON answer object.
   */
  SetAnswersString: function(answers_str) {
    if (answers_str == null || answers_str == '' || answers_str == '*') {
      Logger.Log('SetAnswersString warning: answer ' +
                 answers_str + ' is not a valid json string');
      return;
    }
    this.answers = JSON.parse(answers_str);
  },
};
