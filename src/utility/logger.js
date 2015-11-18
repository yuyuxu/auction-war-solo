Logger = {
  enable: true,

  EnableLogger: function (flag) {
    this.enable = flag;
  },

  Log: function (message) {
    if (this.enable == true) {
      console.log(message);
    }
  },
}

module.exports = Logger;
