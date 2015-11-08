$(document).ready(function () {
	var open_windows = [];
	$('#testing').click(function () {
		var no_tabs = parseInt($('#no-tabs').val());
		for (var i = 0; i < no_tabs; i++) {
			var url = 'http://localhost:3000/test?test_name=' + 'dummy_' + i.toString();
			var winobj = window.open(url);
			open_windows.push(winobj);
		}
	});
	$('#reset').click(function () {
		var no_tabs = open_windows.length;
		for (var i = 0; i < no_tabs; i++) {
			open_windows[i].close();
		}
	});
});