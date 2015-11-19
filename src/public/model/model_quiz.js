/** Model (static, front end) for quiz page data. */
var QuizPageData = {
  /** Model (static, front end) for quiz page data. */
  GatherSubmitData : function() {
    submit_data = [];
    submit_data.push($('input[name=group0]:checked').val());
    submit_data.push($('input[name=group1]:checked').val());
    submit_data.push($('input[name=group2]:checked').val());
    submit_data.push($('input[name=group3]:checked').val());
    submit_data.push($('input[name=group4]:checked').val());
    submit_datastr = JSON.stringify(submit_data);
    return submit_datastr;
  },

  IsSubmitDataValid : function() {
    return true;

    var side = $('#player-side').val();
    if (side == "type-0") {
      if (submit_data[0] == null || submit_data[0] != "sam")  return false;
      if (submit_data[1] == null || submit_data[1] != "high")  return false;
      if (submit_data[2] == null || submit_data[2] != "med")  return false;
      if (submit_data[3] == null || submit_data[3] != "low")  return false;
      if (submit_data[4] == null)  return false;
      return true;
    }
  },

  LoadSubmitData : function(submit_data_str) {
    submit_data = JSON.parse(submit_data_str);
    if (submit_data[0] != null) {
      var $radios = $('input:radio[name=group0]');
      $radios.filter('[value=' + submit_data[0] + ']').prop('checked', true);
    }
    if (submit_data[1] != null) {
      var $radios = $('input:radio[name=group1]');
      $radios.filter('[value=' + submit_data[1] + ']').prop('checked', true);
    }
    if (submit_data[2] != null) {
      var $radios = $('input:radio[name=group2]');
      $radios.filter('[value=' + submit_data[2] + ']').prop('checked', true);
    }
    if (submit_data[3] != null) {
      var $radios = $('input:radio[name=group3]');
      $radios.filter('[value=' + submit_data[3] + ']').prop('checked', true);
    }
    if (submit_data[4] != null) {
      var $radios = $('input:radio[name=group4]');
      $radios.filter('[value=' + submit_data[4] + ']').prop('checked', true);
    }
  }
};