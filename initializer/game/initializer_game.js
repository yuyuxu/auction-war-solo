/**
 * This module handles the page title notification
 */
 var PageTitleNotification = {
  original_title: document.title,
  interval: null,

  On: function(notification, interval_speed) {
    var _this = this;
    _this.interval = setInterval(function() {
       document.title = (_this.original_title == document.title) ?
                        notification : _this.original_title;
    }, (interval_speed) ? interval_speed : 1000);

  },

  Off: function() {
    clearInterval(this.interval);
    document.title = this.original_title;
  }
}

$(document).ready(function() {
  // load page, init game
  window.onload = function() {
    ModuleGame.Init();
  };

  // if focus on this page, turn off page title notification
  $(window).focus(function() {
    PageTitleNotification.Off();
  });

  // leaving page, submit data
  $( "#next-stage" ).click(function() {
    $("#next-stage").closest('form').submit();
  });
});