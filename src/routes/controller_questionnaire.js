var express = require('express');
var logger = require('../utility/logger');
var timer = require('../utility/timer');
var database = require('../data_access/database');
var table_users = require('../data_access/table_users');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/questionnaire', function(req, res) {
  var from = req.body.from;
  var turker_id = req.body.user_id;

  if (turker_id == null) {
    logger.Log('[null] /questionnaire error: turker_id is null');
    res.redirect('/');
    return;
  }

  if (from == 'introduction') {
    // navigated here from page "introduction"
    logger.Log('[' + turker_id + '] ' +
               '/questionnaire: navigated here from page "introduction"');
    var user = manager_user.GetUser(turker_id);
    if (user == null) {
      logger.Log('[' + turker_id + '] ' +
                 '/questionnaire error: user does not exist ');
      res.redirect('/');
      return;
    }
    logger.Log('[' + turker_id + '] ' +
               '/questionnaire: load questionnaire_data from model');
    res.render('view_questionnaire.ejs',
      {user_id: turker_id, questionnaire_data: user.GetData('questionnaire')});
  } else if (from == 'login') {
    // navigated here from page "login"
    logger.Log('[' + turker_id + '] ' +
               '/questionnaire: navigated here from page "login"');
    table_users.GetUserAttributes(turker_id, [], function(err, data) {
      if (err) {
        logger.Log('[' + turker_id + '] ' +
                   '/questionnaire GetUserAttributes error: ' + err);
        res.redirect('/');
        return;
      } else if (Object.keys(data).length == 0) {
        // no such player, create one
        logger.Log('[' + turker_id + '] ' +
                   '/questionnaire: created new user in database and model');
        var player = table_users.CreateUser(turker_id, function(err, data) {
          if (err) {
            logger.Log('[' + turker_id + '] ' +
                       '/questionnaire CreateUser error: ' + err);
          } else {
            var user = manager_user.CreateUser(turker_id);
            user.game_start_time = timer.GetFullTime();
            res.render('view_questionnaire.ejs',
              {user_id: turker_id,
               questionnaire_data: user.GetData('questionnaire')});
          }
        });
      } else {
        // the player does exist (database), fill model with corresponding data
        logger.Log('[' + turker_id + '] ' +
                   '/questionnaire: player exists in database, load');
        var user = manager_user.CreateUser(turker_id);
        user.LoadData(database.ExtractData(data));
        if (user.FinishedGame()) {
          // seems like the player has already played the game
          logger.Log('[' + turker_id + '] ' +
                     '/questionnaire: game finished');
          res.render('view_finish.ejs',
            {user_id: turker_id, reward_code: user.GetData('reward')});
        } else {
          // the existing (model) player hasn't played the game
          user.game_start_time = timer.GetFullTime();
          res.render('view_questionnaire.ejs',
            {user_id: turker_id,
             questionnaire_data: user.GetData('questionnaire')});
        }
      }
    });
  }
});

module.exports = router;
