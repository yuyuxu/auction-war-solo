$( document ).ready(function () {
	
	var errorinfo = $("#error-info").html();
	if (errorinfo != "")
		$("#error-info").css("visibility", "auto");

	$("#login-as-worker").tooltip({
		placement : 'right'
	});	
	$("#login-as-guest").tooltip({
		placement : 'right'
	});
});