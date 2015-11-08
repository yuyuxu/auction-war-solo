var url = require('url');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	var from = req.param('from');
	if (from == 'quiz')
		res.render('view_index.ejs', {error: 'Please try not refresh page, or use backward/forward button from Browser unless notified. Use Navigation Button provided by the web page instead. Re-enter your ID. Your data is intact.', test_name: ''});
	else 
		res.render('view_index.ejs', {error: '', test_name: ''});
});

router.get('/test', function (req, res, next) {
	var url_parts = url.parse(req.url, true);
	var name = url_parts.query['test_name'];
	res.render('view_index.ejs', {error: '', test_name: name});
});

module.exports = router;