var express = require('express');
var signal = require('signal-js');
var manager_db = require('../data_access/aws_dynamodb');
var logger_db = require('../utility/logger').GetLogger('db');
var logger_model = require('../utility/logger').GetLogger('model');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

/**
 * /view_introduction: 
 * take:	user_id, player_side
 * submit: 	user_id, from
 */
router.post('/introduction', function (req, res, next) {
	var turker_id = req.body.user_id;
	var from = req.body.from;
	var t_name = req.body.test_name;

	if (turker_id == null || from == null) {
		res.render('view_index.ejs', {error: '[post] introduction: user_id or from is null.', test_name: ''});
		return;
	}
	var user = manager_user.GetUser(turker_id);
	if (user == null) {
		res.render('view_index.ejs', {error: '[post] introduction: user for this this turker %s does not exist! (' + turker_id + ')', test_name: ''});
		return;
	}
	
	if (from == 'questionnaire') {
		var q_data = req.body.questionnaire_data;
		if (q_data == null)
			res.render('view_index.ejs', {error: '[post] introduction: from questionnaire, questionnaire_data is null.', test_name: ''});
		else {
			user.SetData('questionnaire', q_data);
			manager_db.UpdateAttributeQuestionnaire(turker_id, q_data, function (err, data) {
				if (err) {
					res.render('view_index.ejs', {error: 'UpdateAttributeQuestionnaire Err: ' + err, test_name: ''});
				}
				else {
					signal.trigger('status:introduction', res, turker_id, t_name);
				}
			});
		}
	}
	else if (from == 'quiz') {
		var q_data = req.body.quiz_data;
		if (q_data == null)
			res.render('view_index.ejs', {error: '[post] introduction: from quiz, quiz_data is null.', test_name: ''});
		else {
			user.SetData('quiz', q_data);
			user.SetData('role', '*');
			manager_db.UpdateAttributeQuiz(turker_id, q_data, function (err, data) {
				if (err) {
					res.render('view_index.ejs', {error: 'UpdateAttributeQuiz Err: ' + err, test_name: ''});
				}
				else {
					signal.trigger('status:introduction', res, turker_id, t_name);
				}
			});
		}
	}
	else {
		res.render('view_index.ejs', {error: '[post] introduction: from %s is invalid. (' + from + ')', test_name: ''});
	}
});

signal.on('status:introduction', function (res, turker_id, t_name) {
	var role = manager_user.AssignRole(turker_id);
	var user = manager_user.GetUser(turker_id);

	manager_db.UpdateAttributeRole(turker_id, role, function (err, data) {
		if (err) {
			res.render('view_index.ejs', {error: 'UpdateAttributeRole Err: ' + err, test_name : ''});
		}
		else {
			user.Log({
				type : 'controller',
				data : {
					at : 'introduction',
					to : 'view_introduction.ejs',
				},
			});
			res.render('view_introduction.ejs', {user_id: turker_id, player_side: user.GetData('role'), test_name: t_name});
		}
	});
});

module.exports = router;