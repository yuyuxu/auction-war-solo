var AWS = require('aws-sdk');
var dblogger = require('../utility/logger').GetLogger('db');

ModuleAWSDB = {
	ddb : null,

	MakeId : function () {
		var text = '';
		var dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var id_length = 10;

		for (var i = 0; i < id_length; i++)
			text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
		return text;    
	},

	DefaultCallback : function (err, data) {
		if (err) {
			dblogger.info(err, 'DefaultCallback Error');
			return false;
		}
		else {
			return true;
		}
	},

	InitDB : function () {
		if (this.ddb == null) {
			AWS.config.loadFromPath(__dirname + '/config.json');
			this.ddb = new AWS.DynamoDB();
		}
	},

	GetDB : function () {
		if (this.ddb == null) {
			this.InitDB();
		}
		return this.ddb;
	},

	CreatePlayer : function (user_id, status, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Item : {
				user_id: {S: user_id},
				role: {S: '*'},
				status: {S: status},
				questionnaire: {S: '*'},
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

	DeletePlayer : function (user_id, option, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Key: {
				user_id: {
					S : user_id,
				}
			},
		}
		if (callback == null) {
			callback = this.DefaultCallback;
		}
		this.ddb.deleteItem(param, callback);
	},	

	GetPlayerData : function (user_id, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Key: {
				user_id: {
					S : user_id,
				}
			},
			AttributesToGet: [
				'role',
				'status',
				'questionnaire',
				'quiz',
				'game',
				'reward',
			],
		}
		if (callback == null) {
			callback = this.DefaultCallback;;
		}
		this.ddb.getItem(param, callback);
	},

	GetPlayerAttribute : function(attribute, data) {
		return data['Item'][attribute]['S'];
	},

	UpdateAttributeStatus : function(user_id, status, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Key: {
			  user_id: {
				S : user_id,
			  }
			},
			AttributeUpdates: {
				status: {
					Action: 'PUT',
					Value: {
						S : status,
					}
				}
			}
		}
		if (callback == null) {
			callback = this.DefaultCallback;
		}
		this.ddb.updateItem(param, callback);
	},

	UpdateAttributeQuestionnaire : function (user_id, qdata, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Key: {
				user_id: {
					S : user_id,
				}
			},
			AttributeUpdates: {
				questionnaire: {
					Action: 'PUT',
					Value: {
						S : qdata,
					}
				}
			}
		}
		if (callback == null) {
			callback = this.DefaultCallback;
		}
		this.ddb.updateItem(param, callback);
	},		

	UpdateAttributeRole : function (user_id, role, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Key: {
				user_id: {
					S : user_id,
				}
			},
			AttributeUpdates: {
				role: {
					Action: 'PUT',
					Value: {
						S : role,
					}
				}
			}
		}
		if (callback == null) {
			callback = this.DefaultCallback;
		}
		this.ddb.updateItem(param, callback);      
	},

	UpdateAttributeQuiz : function(user_id, qdata, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Key: {
				user_id: {
					S : user_id,
				}
			},
			AttributeUpdates: {
				quiz: {
					Action: 'PUT',
					Value: {
						S : qdata,
					}
				}
			}
		}
		if (callback == null) {
			callback = this.DefaultCallback;
		}
		this.ddb.updateItem(param, callback);
	},

	UpdateAttributeGame : function (user_id, gdata, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Key: {
				user_id: {
					S : user_id,
				}
			},
			AttributeUpdates: {
				game: {
					Action: 'PUT',
					Value: {
						S : gdata,
					}
				}
			}
		}
		if (callback == null) {
			callback = this.DefaultCallback;
		}
		this.ddb.updateItem(param, callback);      
	},

	UpdateAttributeReward : function (user_id, r, callback) {
		var param = {
			TableName: 'auction-war-user', 
			Key: {
			  user_id: {
				S : user_id,
			  }
			},
			AttributeUpdates: {
				reward: {
					Action: 'PUT',
					Value: {
						S : r,
					}
				}
			}
		}
		if (callback == null) {
			callback = this.DefaultCallback;
		}
		this.ddb.updateItem(param, callback);
	},

	CreateGame : function (game_id, user_array, callback) {
		var param = {
			TableName: 'auction-war-game', 
			Item : {
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

	UpdateAttributeGameActions : function (game_id, gdata, callback) {
		var param = {
			TableName: 'auction-war-game', 
			Key: {
				game_id: {
					S : game_id,
				}
			},
			AttributeUpdates: {
				actions: {
					Action: 'PUT',
					Value: {
						S : gdata,
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