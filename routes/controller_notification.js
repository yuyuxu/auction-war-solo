var express = require('express');
var logger_model = require('../utility/logger').GetLogger('model');
var manager_db = require('../data_access/aws_dynamodb');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/notifyinactive', function (req, res, next) {
	var turker_id = req.body.player_id;
	var from = req.body.from;
	logger_model.info([turker_id, from], '/notifyinactive');
	
	if (turker_id == null || from == null) {
		res.render('view_index.ejs', {error: '[post] notifyinactive: user_id or from is null.', test_name: ''});
		return;
	}	
	var user = manager_user.GetUser(turker_id);
	if (user == null) {
		res.render('view_index.ejs', {error: '[post] notifyinactive: user for this this turker %s does not exist! (' + turker_id + ')', test_name: ''});
		return;
	}

	if (from == 'introduction' || from == 'quiz' || from == 'game') {
		if (from == 'game') {
			manager_user.UnqueuePlayers(turker_id);
		}
		user.SetData('role', '*');
		manager_db.UpdateAttributeRole(turker_id, '*', function (err, data) {
			if (err) {
				res.render('view_index.ejs', {error: 'UpdateAttributeRole Err: ' + err, test_name : ''});
			}
			else {
				res.status(200).end();
			}		
		});
	}
	else {
		res.status(200).end();
	}
});

module.exports = router;