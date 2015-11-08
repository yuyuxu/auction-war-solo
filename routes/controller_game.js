var express = require('express');
var manager_db = require('../data_access/aws_dynamodb');
var logger_model = require('../utility/logger').GetLogger('model');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

/**
 * /view_game: 
 * take:	user_id, player_side
 * submit: 	user_id, from, game_data
 */
router.post('/game', function (req, res, next) {
	var turker_id = req.body.user_id;
	var from = req.body.from;
	var t_name = req.body.test_name;
	if (turker_id == null || from == null) {
		res.render('view_index.ejs', {error: '[post] introduction: questionnaire_data or user_id or from is null.', test_name: t_name});
	}
	var user = manager_user.GetUser(turker_id);
	if (user == null) {
		res.render('view_index.ejs', {error: '[post] introduction: user for this this turker %s is not exist! (' + turker_id + ')', test_name: t_name});
		return;
	}

	var role = user.GetData('role');
	if (role == '*' || role == '') {
		res.redirect('/?from=game');
		return;
	}

	if (from == 'quiz') {
		var q_data = req.body.quiz_data;
		if (q_data == null)
			res.render('view_index.ejs', {error: '[post] game: from quiz, quiz_data is null.', test_name: t_name});
		else {
			user.SetData('quiz', q_data);
			manager_db.UpdateAttributeQuiz(turker_id, q_data, function (err, data) {
				if (err) {
					res.render('view_index.ejs', {error: 'UpdateAttributeQuiz Err: ' + err, test_name: t_name});
				}
				else {
					user.Log({
						type : 'controller',
						data : {
							at : 'game',
							to : 'view_game.ejs',
						},
					});
	  				res.render('view_game.ejs', {user_id: turker_id, player_side: user.GetData('role'), test_name: t_name});
				}
			});
		}
	}
	else {
		res.render('view_index.ejs', {error: '[post] game: from %s is invalid (' + from + ').', test_name: t_name});
  	}
});



module.exports = router;