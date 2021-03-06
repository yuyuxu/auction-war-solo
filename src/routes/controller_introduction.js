var express = require('express');
var logger = require('../utility/logger');
var table_users = require('../data_access/table_users');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/introduction', function(req, res) {
  var from = req.body.from;
  var turker_id = req.body.user_id;

  // validation
  if (turker_id == null) {
    logger.Log('[null] /introduction error: turker_id is null');
    res.redirect('/');
    return;
  }
  var user = manager_user.GetUser(turker_id);
  if (user == null) {
    logger.Log('[' + turker_id + '] ' +
               '/introduction error: user cannot be null');
    res.redirect('/');
    return;
  }

  // controller logic
  if (from == 'questionnaire') {
    // http request comes from questionnaire page
    logger.Log('[' + turker_id + '] ' +
               '/introduction: navigated here from page "questionnaire"');
    var questionnaire_data = req.body.questionnaire_data;
    if (questionnaire_data == null) {
      logger.Log('[' + turker_id + '] ' +
                 '/introduction error: questionnaire_data cannot be null');
      res.redirect('/');
      return;
    } else {
      logger.Log('[' + turker_id + '] ' +
                 '/introduction: update database questionnaire and role');
      user.SetData('questionnaire', questionnaire_data);
      user.SetData('role', manager_user.AssignRole(turker_id));
      table_users.UpdateUserAttributes(turker_id,
                                       {'questionnaire': questionnaire_data,
                                        'role': user.GetData('role')},
                                       function(err, data) {
        if (err) {
          logger.Log('[' + turker_id + '] ' +
                     '/introduction UpdateUserAttributes error: ' + err);
          res.redirect('/');
          return;
        } else {
          res.render('view_introduction.ejs',
            {user_id: turker_id, player_role: user.GetData('role')});
        }
      });
    }
  } else if (from == 'quiz') {
    // http request comes from quiz page
    logger.Log('[' + turker_id + '] ' +
               '/introduction: navigated here from page "quiz"');
    var quiz_data = req.body.quiz_data;
    if (quiz_data == null) {
      logger.Log('[' + turker_id + '] ' +
                 '/introduction error: quiz_data cannot be null');
      res.redirect('/');
      return;
    } else {
      user.SetData('quiz', quiz_data);
      user.SetData('role', manager_user.AssignRole(turker_id));
      logger.Log('[' + turker_id + '] ' +
                 '/introduction: update database quiz_data and role');
      table_users.UpdateUserAttributes(turker_id,
                                       {'quiz': quiz_data,
                                        'role': user.GetData('role')},
                                       function(err, data) {
        if (err) {
          logger.Log('[' + turker_id + '] ' +
                     '/introduction UpdateUserAttributes error: ' + err);
          res.redirect('/');
          return;
        } else {
          res.render('view_introduction.ejs',
            {user_id: turker_id, player_role: user.GetData('role')});
        }
      });
    }
  } else {
    // "from" is invalid
    logger.Log('[' + turker_id + '] ' +
               '/introduction error: from is invalid');
    res.redirect('/');
    return;
  }
});

module.exports = router;
