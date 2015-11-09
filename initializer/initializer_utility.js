var InitializerUtility = {
  enable_log: true,

  EnableLogger: function(flag) {
    this.enable_log = flag;
  },

  Log: function(message) {
    if (this.enable_log) {
      console.log(message);
    }
  },

  GetTimeHMS: function() {
    var cur_date = new Date();
    var cur_time = cur_date.getHours() + ':' +
                   cur_date.getMinutes() + ':' +
                   cur_date.getSeconds();
    return cur_time;
  }
};