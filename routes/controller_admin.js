var express = require('express');

var router = express.Router();

router.get('/admin', function (req, res, next) {
  	res.render('view_admin.ejs', {});
});

module.exports = router;