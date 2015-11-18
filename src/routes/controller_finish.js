var express = require('express');
var logger = require('../utility/logger');
var manager_db = require('../data_access/aws_dynamodb');
var manager_user = require('../model/model_manager_user').GetInstance();

var router = express.Router();

router.post('/finish', function (req, res) {
  var turker_id = req.body.user_id;
  var from = req.body.from;
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
    var reward = manager_db.MakeId();
    user.Log('controller', {from: 'game', to: 'finish',
                            tip: 'updated game data and reward code'});
    user.Log('data', {from: 'game', value: game_data});
    manager_db.UpdatePlayerAttributes(turker_id,
                                      {'game': game_data,
                                       'reward': reward},
                                      function(err, data) {
      if (err) {
        logger.Log('/finish UpdatePlayerAttributes error: ' + err);
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
