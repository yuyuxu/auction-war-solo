var AWS = require('aws-sdk');
var logger = require('../utility/logger');

ModuleAWSDB = {
  ddb: null,

  // helper functions for the database
  MakeId: function () {
    var text = '';
    var dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var id_length = 10;

    for (var i = 0; i < id_length; i++) {
      text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    }
    return text;
  },

  DefaultCallback: function (err, data) {
    if (err) {
      logger.Log('DefaultCallback Error: ' + data);
      return false;
    } else {
      return true;
    }
  },

  InitDB: function () {
    if (this.ddb == null) {
      AWS.config.loadFromPath(__dirname + '/config.json');
      this.ddb = new AWS.DynamoDB();
    }
  },

  GetDB: function () {
    if (this.ddb == null) {
      this.InitDB();
    }
    return this.ddb;
  },

  // player database operations
  CreatePlayer: function (user_id, callback) {
    var param = {
      TableName: 'auction-war-solo-users',
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
    this.ddb.putItem(param, callback);
  },

  DeletePlayer: function (user_id, option, callback) {
    var param = {
      TableName: 'auction-war-solo-users',
      Key: {
        user_id: {
          S: user_id,
        }
      },
    }
    if (callback == null) {
      callback = this.DefaultCallback;
    }
    this.ddb.deleteItem(param, callback);
  },

  GetPlayerAttributes: function(user_id, attributes, callback) {
    /** shorthand, if attributes are "all", get whole data */
    if (attributes == 'all') {
      attributes = [
        'role',
        'questionnaire',
        'quiz',
        'game',
        'reward',
      ];
    }
    var param = {
      TableName: 'auction-war-solo-users',
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
    this.ddb.getItem(param, callback);
  },

  UpdatePlayerAttribute: function(user_id, attribute, value, callback) {
    var param = {
      TableName: 'auction-war-solo-users',
      Key: {
        user_id: {
          S: user_id,
        }
      },
      AttributeUpdates: {
        attribute: {
          Action: 'PUT',
          Value: {
            S: value,
          }
        }
      }
    }
    if (callback == null) {
      callback = this.DefaultCallback;
    }
    this.ddb.updateItem(param, callback);
  },

  // game database operations
  CreateGame: function (game_id, user_array, callback) {
    var param = {
      TableName: 'auction-war-solo-games',
      Item: {
        game_id: {S: game_id},
        user_ids: {S: user_array},
        actions: {S: '*'},
      },
    }
    if (callback == null) {
      callback = this.DefaultCallback;
    }
    this.ddb.putItem(param, callback);
  },

  UpdateGameAttribute: function (game_id, attribute, value, callback) {
    var param = {
      TableName: 'auction-war-solo-games',
      Key: {
        game_id: {
          S: game_id,
        }
      },
      AttributeUpdates: {
        attribute: {
          Action: 'PUT',
          Value: {
            S: value,
          }
        }
      }
    }
    if (callback == null) {
      callback = this.DefaultCallback;
    }
    this.ddb.updateItem(param, callback);
  },
};

ModuleAWSDB.InitDB();
module.exports = ModuleAWSDB;