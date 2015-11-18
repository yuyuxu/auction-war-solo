var express = require('express');
var logger = require('../utility/logger');
var manager_db = require('../data_access/aws_dynamodb');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/questionnaire', function(req, res) {
  var from = req.body.from;
  var turker_id = req.body.user_id;

  if (turker_id == null) {
    logger.Log('/questionnaire error: turker_id is null');
    res.redirect('/');
    return;
  }

  if (from == 'introduction') {
    // navigated here from page "introduction"
    logger.Log('/questionnaire: navigated here from page "introduction"');
    var user = manager_user.GetUser(turker_id);
    if (user == null) {
      logger.Log('/questionnaire error: user does not exist');
      res.redirect('/');
      return;
    }
    user.Log('controller',
      {from: 'introduction', to: 'questionnaire',
       tip: 'existing player according to model'});
    res.render('view_questionnaire.ejs',
      {user_id: turker_id, questionnaire_data: user.GetData('questionnaire')});
  } else if (from == 'login') {
    // navigated here from page "login"
    logger.Log('/questionnaire: navigated here from page "login"');
    manager_db.GetPlayerAttributes(turker_id, 'all', function(err, data) {
      if (err) {
        logger.Log('/questionnaire GetPlayerAttributes error: ' + err);
        res.redirect('/');
        return;
      } else if (Object.keys(data).length == 0) {
        // no such player, create one
        logger.Log('/questionnaire: created new user');
        var player = manager_db.CreatePlayer(turker_id, function(err, data) {
          if (err) {
            logger.Log('/questionnaire CreatePlayer error: ' + err);
          } else {
            var user = manager_user.CreateUser(turker_id);
            user.Log('controller',
              {from: 'introduction', to: 'questionnaire', tip: 'new user'});
            res.render('view_questionnaire.ejs',
              {user_id: turker_id,
               questionnaire_data: user.GetData('questionnaire')});
          }
        });
      } else {
        // the player does exist (database), fill model with corresponding data
        var user = manager_user.CreateUser(turker_id);
        user.LoadData(data);
        if (user.FinishedGame() == true) {
          logger.Log('/questionnaire: grab user from database, game finished');
          // seems like the player has already played the game
          user.Log('finished', {at: '/questionnaire'});
          res.render('view_finish.ejs',
            {user_id: turker_id, reward_code: user.GetData('reward')});
        } else {
          // the existing (model) player hasn't played the game
          logger.Log('/questionnaire: grab user from database, player loaded');
          user.Log('controller',
            {from: 'introduction', to: 'questionnaire',
             tip: 'existing player according to database'});
          res.render('view_questionnaire.ejs',
            {user_id: turker_id,
             questionnaire_data: user.GetData('questionnaire')});
        }
      }
    });
  }
});

module.exports = router;
