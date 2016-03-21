var express = require('express');
var logger = require('../utility/logger');
var helpers = require('../utility/helpers');
var table_users = require('../data_access/table_users');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/finish', function (req, res) {
  var from = req.body.from;
  var turker_id = req.body.user_id;
  var game_data = req.body.game_data;

  // validation
  if (turker_id == null) {
    logger.Log('/finish error: turker_id is null');
    res.redirect('/');
    return;
  }
  if (game_data == null) {
    logger.Log('/finish error: game data cannot be null');
    res.redirect('/');
    return;
  }
  var user = manager_user.GetUser(turker_id);
  if (user == null) {
    logger.Log('/finish error: user cannot be null');
    res.redirect('/');
    return;
  }

  if (from == 'game') {
    var reward = helpers.MakeId();
    logger.Log({type: 'controller', from: 'game', to: 'finish',
                tip: 'updated game data and reward code'});
    logger.Log({type: 'data', from: 'game', value: game_data});
    if (game_data == '') {
      game_data = '*';
      logger.Log('/finish error: game_data is empty');
    }
    table_users.UpdateUserAttributes(turker_id,
                                     {'game': game_data,
                                      'reward': reward},
                                     function(err, data) {
      if (err) {
        logger.Log('/finish UpdateUserAttributes error: ' + err);
        res.redirect('/');
        return;
      } else {
        res.render('view_finish.ejs',
                   {user_id: turker_id, reward_code: reward});
      }
    });
  } else {
    // "from" is invalid
    logger.Log('/finish error: from is invalid');
    res.redirect('/');
    return;
  }
});

module.exports = router;
