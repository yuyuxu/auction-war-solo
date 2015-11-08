/**
 * Get current time in format Hour:Miniute:Second
 * @param {string} input_user_id - The input user id.
 */
exports.GetTimeHMS = function () {
	var cur_date = new Date();
	var cur_time = cur_date.getHours() + ':' + cur_date.getMinutes() + ':' + cur_date.getSeconds();
	return cur_time;
}