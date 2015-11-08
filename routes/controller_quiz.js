var express = require('express');
var signal = require('signal-js');
var manager_db = require('../data_access/aws_dynamodb');
var manager_user = require('../model/model_manager_user').GetInstance();
var logger_model = require('../utility/logger').GetLogger('model');

var router = express.Router();

/**
 * /view_introquiz: 
 * take:	user_id, player_side, quiz_data
 * submit: 	user_id, from, quiz_data
 */
router.post('/quiz', function (req, res, next) {
	var turker_id = req.body.user_id;
	var from = req.body.from;
	var t_name = req.body.test_name;

	if (turker_id == null || from == null) {
		res.render('view_index.ejs', {error: '[post] introduction: questionnaire_data or user_id or from is null.', test_name: t_name});
		return;
	}
	var user = manager_user.GetUser(turker_id);
	if (user == null) {
		res.render('view_index.ejs', {error: '[post] introduction: user for this this turker %s is not exist! (' + turker_id + ')', test_name: t_name});
		return;
	}

	var role = user.GetData('role');
	if (role == '*' || role == '') {
		res.redirect('/?from=quiz');
		return;
	}

	user.Log({
		type : 'controller',
		data : {
			at : 'quiz',
			to : 'view_introquiz.ejs',
		},
	});
	res.render('view_introquiz.ejs', {user_id: turker_id, player_side: user.GetData('role'), quiz_data: user.GetData('quiz'), test_name: t_name});
});

module.exports = router;