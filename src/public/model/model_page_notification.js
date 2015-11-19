/** Model (static, front end) for page title notification. */
var PageTitleNotification = {
  /**
   * Backup previous document title.
   *@type {string}
   */
  original_title: document.title,

  /**
   * Time interval to show the notification.
   *@type {double}
   */
  interval: null,

  /**
   * Set the notification on.
   *@param {string} notification - what to notify.
   *@param {double} interval_speed - how frequent to blink the notfication.
   */
  On: function(notification, interval_speed) {
    var _this = this;
    _this.Off();
    _this.interval = setInterval(function() {
       document.title = (_this.original_title == document.title) ?
                        notification : _this.original_title;
    }, (interval_speed) ? interval_speed : 1000);
  },

  /** Set the notification off. */
  Off: function() {
    clearInterval(this.interval);
    document.title = this.original_title;
  },
}
