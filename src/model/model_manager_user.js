var logger = require('../utility/logger');
var User = require('./model_user');

/** Model (singleton object) for user management. */
var ManagerUser = (function() {
  /** singleton instance
   * @type {Object}
   */
  var instance = null;

  /** list of users
   * @type {Object.<string, User>}
   */
  var users_map = {};

  function Init () {
    return {
      /** API. Create user.
      * @param {string} user_id - id string of the user
      */
      CreateUser: function(user_id) {
        users_map[user_id] = new User(user_id);
        return users_map[user_id];
      },

      /** API. Get user.
      * @param {string} user_id - id string of the user
      */
      GetUser: function(user_id) {
        return users_map[user_id];
      },

      /** API. Get the user map. */
      GetUsers : function() {
        return users_map;
      },

      /** API. Get user.
      * @param {string} user_id - id string of the user
      */
      HasUser : function(user_id) {
        if (users_map[user_id] == null) {
          return false;
        }
        return true;
      },

      /** API. Assign role of the user.
      * For now it's just a placeholder with only one default type.
      * @param {string} user_id - id string of the user
      */
      AssignRole : function(user_id) {
        var user = this.GetUser(user_id);
        return 'type-0';
      }
    };
  };

  return {
    /** Get singleton object. */
    GetInstance: function() {
      if (!instance) {
        instance = Init();
      }
      return instance;
    }
  };

})();

module.exports = ManagerUser;