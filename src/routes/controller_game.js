var express = require('express');
var logger = require('../utility/logger');
var table_users = require('../data_access/table_users');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/game', function(req, res, next) {
  var from = req.body.from;
  var turker_id = req.body.user_id;

  // validation
  if (turker_id == null) {
    logger.Log('[null] /game error: turker_id is null');
    res.redirect('/');
    return;
  }
  var user = manager_user.GetUser(turker_id);
  if (user == null) {
    logger.Log('[' + turker_id + '] ' + '/game error: user cannot be null');
    res.redirect('/');
    return;
  }
  var role = user.GetData('role');
  if (role == '*' || role == '') {
    logger.Log('[' + turker_id + '] ' + '/game error: user cannot be null');
    res.redirect('/');
    return;
  }

  if (from == 'quiz') {
    logger.Log('[' + turker_id + '] ' +
               '/game: navigated here from page "quiz"');
    var quiz_data = req.body.quiz_data;
    if (quiz_data == null) {
      logger.Log('[' + turker_id + '] ' +
                 '/game error: quiz data cannot be null');
      res.redirect('/');
      return;
    } else {
      logger.Log('[' + turker_id + '] ' +
                 '/game: update database quiz_data');
      user.SetData('quiz', quiz_data);
      table_users.UpdateUserAttributes(turker_id,
                                       {'quiz': quiz_data},
                                       function(err, data) {
        if (err) {
          logger.Log('[' + turker_id + '] ' +
                     '/game error: UpdateUserAttributes error ' + err);
          res.redirect('/');
          return;
        } else {
          res.render('view_game.ejs', {user_id: turker_id,
                                       player_role: user.GetData('role')});
        }
      });
    }
  } else {
    logger.Log('[' + turker_id + '] ' + '/game error: from is invalid ' + from);
    res.redirect('/');
    return;
  }
});

module.exports = router;
