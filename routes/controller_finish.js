var express = require('express');
var manager_user = require('../model/model_manager_user').GetInstance();
var manager_game = require('../model/model_manager_game').GetInstance();
var manager_db = require('../data_access/aws_dynamodb');
var logger_model = require('../utility/logger').GetLogger('model');

var router = express.Router();

router.post('/finish', function (req, res, next) {
	var turker_id = req.body.user_id;
	var from = req.body.from;
	var t_name = req.body.test_name;
	var g_data = req.body.game_data;

	if (turker_id == null || from == null || g_data == null) {
		res.render('view_index.ejs', {error: '[post] finish: game_data or user_id or from is null.', test_name: t_name});
	}

	var user = manager_user.GetUser(turker_id);
	if (user == null) {
		res.render('view_index.ejs', {error: '[post] finish: user for this this turker %s is not exist! (' + turker_id + ')', test_name: t_name});
	}
	
	user.Log({
		type : 'controller',
		data : {
			at : 'finish',
			to : 'view_finish.ejs',
		},
	});
	user.Log({
		type : 'game',
		data : g_data,
	});

	var reward = manager_db.MakeId();

	manager_db.UpdateAttributeReward(turker_id, reward, function (err, d) {
		if (err) {
			res.render('view_index.ejs', {error: '[post] finish: UpdateAttributeReward Err! ' + err, test_name: t_name});
		}
		else {
			res.render('view_finish.ejs', {user_id: turker_id, reward_code: reward});			
		}
	});
});

module.exports = router;