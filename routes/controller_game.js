var express = require('express');
var logger_model = require('../utility/logger');
var manager_db = require('../data_access/aws_dynamodb');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/game', function (req, res, next) {
  var from = req.body.from;
  var turker_id = req.body.user_id;

  // validation
  if (turker_id == null) {
    logger.Log('/quiz error: turker_id is null');
    res.redirect('/');
    return;
  }
  var user = manager_user.GetUser(turker_id);
  if (user == null) {
    logger.Log('/quiz error: user cannot be null');
    res.redirect('/');
    return;
  }
  var role = user.GetData('role');
  if (role == '*' || role == '') {
    logger.Log('/quiz error: user cannot be null');
    res.redirect('/');
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