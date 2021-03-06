/** Setup this web app use express framework. */
// include modules
var express = require('express');
var body_parser = require('body-parser');
var cookie_parser = require('cookie-parser');
var path = require('path');

// create an express object
var app = express();

// setup view engine and views
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

// mount parsers
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
app.use(cookie_parser());

// mount static assets and scripts
app.use(express.static(path.join(__dirname, 'public/assets')));
app.use(express.static(path.join(__dirname, 'public/initializer')));
app.use(express.static(path.join(__dirname, 'public/view_model')));
app.use(express.static(path.join(__dirname, 'public/model')));
app.use(express.static(path.join(__dirname, 'public/game')));
app.use(express.static(path.join(__dirname, 'public/utility')));
app.use(express.static(path.join(__dirname, 'public/constants')));

// mount controller functions
app.use(require('./routes/controller_login'));
app.use(require('./routes/controller_questionnaire'));
app.use(require('./routes/controller_introduction'));
app.use(require('./routes/controller_quiz'));
app.use(require('./routes/controller_game'));
app.use(require('./routes/controller_finish'));

// mount function that catches 404 and forward it to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// handle development error, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('view_error', {
      message: err.message,
      error: err.toString()
    });
    return;
  });
}

// handle production error, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('view_error', {
    message: err.message,
    error: 'N / A',
  });
  return;
});

// run server
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('auction-war app listening at http://%s:%s', host, port);
})

module.exports = app;
