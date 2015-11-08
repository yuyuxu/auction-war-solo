/**
 * Client page to notify server when it's activated.
 * @param {string} input_user_id - The input user id.
 * @param {string} input_page_type - Type of page that sends the notification.
 */
function NotifyActive(input_user_id, where_from) {
	$.ajax({
		url : '/notifyactive',
		data : {pid: input_user_id, from: where_from},
		type : 'POST',
		timeout : 10000,
		success : function(data) {
		}
	});
}

/**
 * Client page to notify server when it's deactivated.
 * @param {string} input_user_id - The input user id.
 */
function NotifyInactive(input_user_id, where_from) {
	$.ajax({
		async: false,
		url : '/notifyinactive',
		data : {player_id: input_user_id, from: where_from},
		type : 'POST',
		timeout : 10000,
		success : function(data) {
		}
	});
}

function GetTimeHMS () {
	var cur_date = new Date();
	var cur_time = cur_date.getHours() + ':' + cur_date.getMinutes() + ':' + cur_date.getSeconds();
	return cur_time;
}

var SwitchLog = false;

function ClientLog (message) {
	if (SwitchLog) {
		console.log(message);
	}
}