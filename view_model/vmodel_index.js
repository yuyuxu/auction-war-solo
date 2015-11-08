$( document ).ready(function () {

	// testing framework
	var test_name = $("#test-name").val();
	if (test_name != '') {
		$('#input-id').val(test_name);
		$( "#login-as-worker" ).trigger("click");
	}
});