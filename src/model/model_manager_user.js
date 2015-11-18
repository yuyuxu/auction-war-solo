var logger = require('../utility/logger');
var User = require('./model_user');

/**
 * Singleton manager that contain user model
 */
var ManagerUser = (function() {
  var instance = null;
  var users_map = {};

  function Init () {
    return {
      CreateUser: function(user_id) {
        users_map[user_id] = new User(user_id);
        return users_map[user_id];
      },

      GetUser: function(user_id) {
        return users_map[user_id];
      },

      GetUsers : function() {
        return users_map;
      },

      HasUser : function(user_id) {
        if (users_map[user_id] == null) {
          return false;
        }
        return true;
      },

      // for now there's only one type of role
      AssignRole : function(user_id) {
        var user = this.GetUser(user_id);
        return 'type-0';
      }
    };
  };

  return {
    GetInstance: function() {
      if (!instance) {
        instance = Init();
      }
      return instance;
    }
  };

})();

module.exports = ManagerUser;