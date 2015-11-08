var express = require('express');
var signal = require('signal-js');
var manager_db = require('../data_access/aws_dynamodb');
var logger_db = require('../utility/logger').GetLogger('db');
var logger_model = require('../utility/logger').GetLogger('model');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

/**
 * /view_questionnaire: 
 * take:	user_id, questionnaire_data
 * submit: 	user_id, from, test_name, questionnaire_data
 */
router.post('/questionnaire', function (req, res, next) {
	var turker_id = req.body.user_id;
	var from = req.body.from;
	var t_name = req.body.test_name;
	logger_model.info([from], '/questionnaire');

	if (turker_id == null) {
		signal.trigger('error:ques', res, '[post] questionnaire: user_id is null.');
		return;
	}

	if (from == 'introduction') {
		var user = manager_user.GetUser(turker_id);
		if (user == null) {
			res.render('view_index.ejs', {error: '[post] introduction: user for this this turker %s does not exist! (' + turker_id + ')', test_name: ''});
			return;
		}
		user.SetData('role', '*');
		manager_db.UpdateAttributeRole(turker_id, '*', function (err, data) {
			if (err) {
				res.render('view_index.ejs', {error: 'UpdateAttributeQuiz Err: ' + err, test_name: ''});
			}
			else {
				signal.trigger('status:ques', res, turker_id, t_name);
			}
		});
	}
	else {
		manager_db.GetPlayerData(turker_id, function (err, data) {
			if (err) { 
				signal.trigger('error:ques', res, ('GetPlayerData Err: ' + err));
			}
			else {
				if (Object.keys(data).length == 0) {
					signal.trigger('db:no-player', res, turker_id, t_name);
				}
				else {
					var user = manager_user.CreateUser(turker_id);
					user.LoadData(data);
					if (user.FinishedGame()) {
						signal.trigger('status:finished', res, turker_id);
					}
					else {
						signal.trigger('status:ques', res, turker_id, t_name);
					}
				}
			}
		});
	}
});

signal.on('db:no-player', function (res, turker_id, t_name) {
	var user = manager_user.CreateUser(turker_id);
	manager_db.CreatePlayer(turker_id, 'online', function (err, data) {
		if (err) signal.trigger('error:ques', res, ('CreatePlayer Err: ' + err));
		else {
			signal.trigger('status:ques', res, turker_id, t_name);
		}
	});
});

signal.on('status:ques', function (res, turker_id, t_name) {
	var user = manager_user.GetUser(turker_id);
	if (user == null) signal.trigger('error:ques', res, '[post] questionnaire: user is null.');
	user.Log({
		type : 'controller',
		data : {
			at : 'questionnaire',
			to : 'view_questionnaire.ejs',
		},
	});
	res.render('view_questionnaire.ejs', {user_id: turker_id, questionnaire_data: user.GetData('questionnaire'), test_name: t_name});
});

signal.on('status:finished', function (res, turker_id) {
	var user = manager_user.GetUser(turker_id);
	if (user == null)	signal.trigger('error:ques', res, '[post] questionnaire: user is null.');
	user.Log({
		type : 'controller',
		data : {
			at : 'questionnaire',
			to : 'view_finish.ejs',
		},
	});
	res.render('view_finish.ejs', {user_id: turker_id, reward_code: user.GetData('reward')});
});

signal.on('error:ques', function (res, err_message) {
	res.render('view_index.ejs', {error: err_message, test_name: ''});
});


module.exports = router;