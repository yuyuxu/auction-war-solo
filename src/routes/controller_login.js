var express = require('express');
var logger = require('../utility/Logger');

var router = express.Router();

router.get('/', function (req, res) {
  // res.render('view_login.ejs', {error: ''});

  res.render('view_game.ejs', {user_id: 'dummy',
                               player_role: 'type-0'});
});

module.exports = router;
