var database = require('./database');
var logger = require('../utility/logger');

/** Model (static) for table that contains all the users. */
var ModelTableUsers = {
  /** Table name. */
  table_name: '',

  /** API. Init table name. */
  Init: function(name) {
    if (name == null) {
      this.table_name = 'auction-war-solo-users';
    } else {
      this.table_name = name;
    }
    logger.Log('ModelTableUsers initialized with table name ' +
               this.table_name + ' ...');
  },

  /** API. Create user.
   *
   * @param {string} user_id - user id.
   * @param {Object} callback - function object to callback.
   */
  CreateUser: function(user_id, callback) {
    if (database.GetType() == 'dynamo') {
      var param = {
        TableName: this.table_name,
        Item: {
          user_id: {S: user_id},
          questionnaire: {S: '*'},
          role: {S: '*'},
          quiz: {S: '*'},
          game: {S: '*'},
          reward: {S: '*'}
        },
      }
      if (callback == null) {
        callback = this.DefaultCallback;
      }
      database.GetDbObj().putItem(param, callback);
    } else {
      logger.Log('CreateUser Error: database type not supported!');
    }
  },

  /** API. Delete user.
   *
   * @param {string} user_id - user id.
   * @param {Object} callback - function object to callback.
   */
  DeleteUser: function(user_id, callback) {
    if (database.GetType() == 'dynamo') {
      var param = {
        TableName: this.table_name,
        Key: {
          user_id: {
            S: user_id,
          }
        },
      }
      if (callback == null) {
        callback = this.DefaultCallback;
      }
      database.GetDbObj().deleteItem(param, callback);
    } else {
      logger.Log('DeleteUser Error: database type not supported!');
    }
  },

  /** API. Get attributes.
   *
   * @param {string} user_id - user id.
   * @param {string[]} attributes - list of attribute name strings.
   *                                if it's empty, return all attributes.
   * @param {Object} callback - function object to callback.
   */
  GetUserAttributes: function(user_id, attributes, callback) {
    if (database.GetType() == 'dynamo') {
      if (attributes.length == 0) {
        attributes = [
          'role',
          'questionnaire',
          'quiz',
          'game',
          'reward',
        ];
      }
      var param = {
        TableName: this.table_name,
        Key: {
          user_id: {
            S: user_id,
          }
        },
        AttributesToGet: attributes,
      }
      if (callback == null) {
        callback = this.DefaultCallback;;
      }
      database.GetDbObj().getItem(param, callback);
    } else {
      logger.Log('GetUserAttributes Error: database type not supported!');
    }
  },

  /** API. Get attributes.
   *
   * @param {string} user_id - user id.
   * @param {string[]} attributes - list of attribute name strings.
   *                                if it's empty, return all attributes.
   * @param {Object} callback - function object to callback.
   */
  UpdateUserAttributes: function(user_id, attributes, callback) {
    if (database.GetType() == 'dynamo') {
      // construct map to pass into database call
      var attribute_keys = {};
      for (var key in attributes) {
        attribute_keys[key] = {
          Action: 'PUT',
          Value: {
            S: attributes[key],
          }
        };
      }
      var param = {
        TableName: 'auction-war-solo-users',
        Key: {
          user_id: {
            S: user_id,
          }
        },
        AttributeUpdates: attribute_keys,
      }
      if (callback == null) {
        callback = this.DefaultCallback;
      }
      database.GetDbObj().updateItem(param, callback);
    } else {
      logger.Log('UpdateUserAttributes Error: database type not supported!');
    }
  },

  /** Default callback function. */
  DefaultCallback: function(err, data) {
    if (err) {
      logger.Log('DefaultCallback Error: ' + JSON.stringify(data));
      return false;
    } else {
      return true;
    }
  },
};

module.exports = ModelTableUsers;
ModelTableUsers.Init();
