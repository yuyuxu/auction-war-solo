var logger = require('../utility/logger');
var User = require('./model_user');

/**
 * Singleton manager that contain user model
 */
var ManagerUser = (function () {
  var instance = null;
  var users_map = {};

  function Init () {
    return {
      CreateUser: function (user_id) {
        users_map[user_id] = new User(user_id);
        return users_map[user_id];
      },

      GetUser: function (user_id) {
        return users_map[user_id];
      },

      GetUsers : function () {
        return users_map;
      },

      HasUser : function (user_id) {
        if (users_map[user_id] == null) {
          return false;
        }
        return true;
      },

      AssignRole : function (user_id, role) {
        var user = this.GetUser(user_id);
        user.SetData('role', role);
      }
    };
  };

  return {
    GetInstance: function () {
      if (!instance) {
        instance = Init();
      }
      return instance;
    }
  };

})();

module.exports = ManagerUser;