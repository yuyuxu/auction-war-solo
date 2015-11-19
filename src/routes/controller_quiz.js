var express = require('express');
var logger = require('../utility/logger');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/quiz', function (req, res) {
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

  if (from == 'introduction') {
    logger.Log('/quiz: navigated here from page "introduction"');
    logger.Log({type: 'controller', from: 'introduction', to: 'quiz',
                tip: 'load quiz data'});
    res.render('view_quiz.ejs', {user_id: turker_id,
                                 player_role: user.GetData('role'),
                                 quiz_data: user.GetData('quiz')});
  } else {
    logger.Log('/quiz error: from is invalid ' + from);
    res.redirect('/');
    return;
  }
});

module.exports = router;
