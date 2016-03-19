var timer = require('./timer');

/** Model (static) for the logger on back end. */
var Logger = {
  /**
   * Global flag to turn on/off logger.
   *@type {boolean}
   */
  enable: true,

  /** API. Enable or disable logger */
  EnableLogger: function (flag) {
    this.enable = flag;
  },

  /** API. Log to console.
   * @param {string} message - what to log.
   */
  Log: function (message) {
    if (this.enable == true) {
      console.log('-- Server Log: ' + message);
    }
  },

  /** API. Log to file. Time stamp is automatically added.
   * @param {string} file_name - log to file given file name.
   * @param {Object<string, string>} data - a map containing what to log.
   */
  LogFile: function(file_name, data) {
    // get data string
    data['time'] = timer.GetFullTime();
    data_str = JSON.stringify(data);

    // log to file
    var log_file = path.join(__dirname, '../bin/logs/' +
                                        this.user_id +
                                        '_server.json');
    fs.exists(log_file, function(exists) {
      if (!exists) {
        fs.writeFile(log_file, data_str, function(err) {
          if (err) {
            this.Log(err);
          }
        });
      } else {
        fs.appendFile(log_file, data_str, function(err) {
          if (err) {
            this.Log(err);
          }
        });
      }
    });
  }
}

module.exports = Logger;
