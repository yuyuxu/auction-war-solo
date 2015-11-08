var express = require('express');
var logger = require('../utility/Logger');

var router = express.Router();

router.get('/', function (req, res) {
  res.render('view_login.ejs', {error: ''});
});

module.exports = router;
