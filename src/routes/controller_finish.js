var express = require('express');
var logger = require('../utility/logger');
var helpers = require('../utility/helpers');
var timer = require('../utility/timer');
var table_users = require('../data_access/table_users');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/finish', function (req, res) {
  var from = req.body.from;
  var turker_id = req.body.user_id;
  var game_data = req.body.game_data;

  // validation
  if (turker_id == null) {
    logger.Log('[' + turker_id + '] ' + '/finish error: turker_id is null');
    res.redirect('/');
    return;
  }
  if (game_data == null) {
    logger.Log('[' + turker_id + '] ' +
               '/finish error: game data cannot be null');
    res.redirect('/');
    return;
  }
  var user = manager_user.GetUser(turker_id);
  if (user == null) {
    logger.Log('[' + turker_id + '] ' +
               '/finish error: user cannot be null');
    res.redirect('/');
    return;
  }
  user.game_finish_time = timer.GetFullTime();
  logger.Log('[' + turker_id + '] ' +
             '/finish: game_start_time - ' + user.game_start_time +
             ' game_finish_time - ' + user.game_finish_time);

  if (from == 'game') {
    logger.Log('[' + turker_id + '] ' +
               '/finish: navigated here from page "game"');
    var reward = helpers.MakeId();
    if (game_data == '') {
      game_data = '*';
      logger.Log('[' + turker_id + '] ' +
                 '/finish error: game_data is empty');
    }
    logger.Log('[' + turker_id + '] ' +
               '/introduction: update database game_data and reward');
    table_users.UpdateUserAttributes(turker_id,
                                     {'game': game_data,
                                      'reward': reward},
                                     function(err, data) {
      if (err) {
        logger.Log('[' + turker_id + '] ' +
                   '/finish UpdateUserAttributes error: ' + err);
        res.redirect('/');
        return;
      } else {
        res.render('view_finish.ejs',
                   {user_id: turker_id, reward_code: reward});
      }
    });
  } else {
    // "from" is invalid
    logger.Log('[' + turker_id + '] ' +
               '/finish error: from is invalid');
    res.redirect('/');
    return;
  }
});

module.exports = router;
