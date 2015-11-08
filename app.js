// include package
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookie_parser = require('cookie-parser');
var body_parser = require('body-parser');
var socket_io = require('socket.io');
var ejs = require('ejs');
var model_socket = require('./model/model_socket');

// setup express(http) and socket server
var app = express();

// some global configuration variables
app.set('env', 'production');

// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment: after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
// uncomment: if you want to see the request log
// app.use(logger('dev'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
app.use(cookie_parser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view_model')));
app.use(express.static(path.join(__dirname, 'model')));
app.use(express.static(path.join(__dirname, 'utility')));
app.use(express.static(path.join(__dirname, 'data_access')));

app.use(require('./routes/controller_index'));
app.use(require('./routes/controller_questionnaire'));
app.use(require('./routes/controller_introduction'));
app.use(require('./routes/controller_quiz'));
app.use(require('./routes/controller_game'));
app.use(require('./routes/controller_finish'));
app.use(require('./routes/controller_admin'));
app.use(require('./routes/controller_notification'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('view_error', {
			message: err.message,
			error: err.toString()
		});
		return;
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('view_error', {
		message: err.message,
		error: 'N / A',
	});
	return;
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('auction-war app listening at http://%s:%s', host, port);
})
model_socket.Listen(server);

module.exports = app;