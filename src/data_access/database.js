var aws = require('aws-sdk');
var logger = require('../utility/logger');

/** Model (static) for database. */
var ModelDatabase = {
  /** Database object. */
  database: null,

  /** Database type. */
  database_type: '',

  /** API. Use this function to get the database object. */
  GetDatabase: function() {
    if (this.database == null) {
      this.InitDatabase();
    }
    return this.database;
  },

  /** API. Use this function to get the type of database. */
  GetType: function() {
    return this.type;
  },

  /** Init database given type
   * @param {string} type - So far only dynamodb is supported.
   */
  InitDatabase: function(type) {
    // init type
    if (type == null) {
      type = 'dynamo';
    }

    // init database
    if (type == 'dynamo') {
      if (this.database == null) {
        aws.config.loadFromPath(__dirname + '../constants/config_aws.json');
        this.database = new aws.DynamoDB();
      }
    } else {
      logger.Log('InitDatabase Error: type not supported ' + type);
    }

    this.type = type;
  },

  /** API. Load information out of returned data from database.
   * @param {Object<string, Object<string, Object<string, string> > >} data -
   *   items returned from database, each database might have different format.
   */
  ExtractData: function(data) {
    var extracted_data = null;
    if (database.GetType() == 'dynamo') {
      for (key in data) {
        extracted_data[key] = data['Item'][key]['S'];
      }
    } else {
      logger.Log('ExtractData Error: database type not supported!');
    }
    return extracted_data;
  }
};

module.exports = ModelDatabase;
