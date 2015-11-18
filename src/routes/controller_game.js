var express = require('express');
var logger = require('../utility/logger');
var manager_db = require('../data_access/aws_dynamodb');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/game', function(req, res, next) {
  var from = req.body.from;
  var turker_id = req.body.user_id;

  // validation
  if (turker_id == null) {
    logger.Log('/game error: turker_id is null');
    res.redirect('/');
    return;
  }
  var user = manager_user.GetUser(turker_id);
  if (user == null) {
    logger.Log('/game error: user cannot be null');
    res.redirect('/');
    return;
  }
  var role = user.GetData('role');
  if (role == '*' || role == '') {
    logger.Log('/game error: user cannot be null');
    res.redirect('/');
    return;
  }

  if (from == 'quiz') {
    var quiz_data = req.body.quiz_data;
    if (quiz_data == null) {
      logger.Log('/game error: quiz data cannot be null');
      res.redirect('/');
      return;
    } else {
      user.SetData('quiz', quiz_data);
      manager_db.UpdatePlayerAttributes(turker_id,
                                        {'quiz': quiz_data},
                                        function(err, data) {
        if (err) {
          logger.Log('/game error: UpdatePlayerAttributes error ' + err);
          res.redirect('/');
          return;
        } else {
          user.Log('controller', {from: 'quiz', to: 'game',
                                  tip: 'updated database quiz data'});
          res.render('view_game.ejs', {user_id: turker_id,
                                       player_role: user.GetData('role')});
        }
      });
    }
  } else {
    logger.Log('/game error: from is invalid ' + from);
    res.redirect('/');
    return;
  }
});

module.exports = router;
