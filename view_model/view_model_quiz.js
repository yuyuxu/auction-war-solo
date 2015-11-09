var VModelQuiz = {
	is_test : false,

	GetSubmitData : function () {
		submitdata = [];
		submitdata.push($('input[name=group0]:checked').val());
		submitdata.push($('input[name=group1]:checked').val());
		submitdata.push($('input[name=group2]:checked').val());
		submitdata.push($('input[name=group3]:checked').val());
		submitdata.push($('input[name=group4]:checked').val());
		submitdatastr = JSON.stringify(submitdata);
		$('#quiz-data_prev').val(submitdatastr);
		$('#quiz-data_next').val(submitdatastr);
		return submitdata;
	},

	IsSubmitDataValid : function () {
		if (this.is_test)	return true;
		
		var side = $('#player-side').val();
		if (side == "Sam-0") {
			if (submitdata[0] == null || submitdata[0] != "sam")  return false;
			if (submitdata[1] == null || submitdata[1] != "high")  return false;
			if (submitdata[2] == null || submitdata[2] != "med")  return false;  
			if (submitdata[3] == null || submitdata[3] != "low")  return false;  
			if (submitdata[4] == null)  return false;
			return true;
		}
		if (side == "Alex-0") {
			if (submitdata[0] == null || submitdata[0] != "alex")  return false;
			if (submitdata[1] == null || submitdata[1] != "high")  return false;
			if (submitdata[2] == null || submitdata[2] != "med")  return false;  
			if (submitdata[3] == null || submitdata[3] != "none")  return false;
			if (submitdata[4] == null)  return false;
			return true;
		}
		if (side == "Alex-1") {
			if (submitdata[0] == null || submitdata[0] != "alex")  return false;
			if (submitdata[1] == null || submitdata[1] != "med")  return false;
			if (submitdata[2] == null || submitdata[2] != "high")  return false;  
			if (submitdata[3] == null || submitdata[3] != "none")  return false;
			if (submitdata[4] == null)  return false;
			return true;
		}          
	},

	SetSubmitData : function (submitdata) {
		if (submitdata[0] != null) {
			var $radios = $('input:radio[name=group0]');
			$radios.filter('[value=' + submitdata[0] + ']').prop('checked', true);
		}          
		if (submitdata[1] != null) {
			var $radios = $('input:radio[name=group1]');
			$radios.filter('[value=' + submitdata[1] + ']').prop('checked', true);
		}
		if (submitdata[2] != null) {
			var $radios = $('input:radio[name=group2]');
			$radios.filter('[value=' + submitdata[2] + ']').prop('checked', true);
		}
		if (submitdata[3] != null) {
			var $radios = $('input:radio[name=group3]');
			$radios.filter('[value=' + submitdata[3] + ']').prop('checked', true);
		}
		if (submitdata[4] != null) {
			var $radios = $('input:radio[name=group4]');
			$radios.filter('[value=' + submitdata[4] + ']').prop('checked', true);
		}
	}
};