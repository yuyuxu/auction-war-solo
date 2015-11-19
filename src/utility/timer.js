/** Timer functions. */

/** Get current time in string format "Hour:Miniute:Second" */
exports.GetTimeHMS = function() {
  var cur_date = new Date();
  var cur_time = cur_date.getHours() + ':' +
                 cur_date.getMinutes() + ':' +
                 cur_date.getSeconds();
  return cur_time;
}

/** Get current time in string format "Year:Month:Day:Hour:Miniute:Second" */
exports.GetFullTime = function() {
  var cur_date = new Date();
  var cur_time = cur_date.getYear() + ':' +
                 cur_date.getMonth() + ':' +
                 cur_date.getDay() + ':' +
                 cur_date.getHours() + ':' +
                 cur_date.getMinutes() + ':' +
                 cur_date.getSeconds();
  return cur_time;
}
