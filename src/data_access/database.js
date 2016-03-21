var aws = require('aws-sdk');
var logger = require('../utility/logger');
var https = require('https');

/** Model (static) for database. */
var ModelDatabase = {
  /** Database object. */
  database: null,

  /** Database type. */
  database_type: '',

  /** API. Use this function to get the type of database. */
  GetType: function() {
    return this.type;
  },

  /** Init database given type
   * @param {string} type - So far only dynamodb is supported.
   */
  Init: function(type) {
    // init type
    if (type == null) {
      type = 'dynamo';
    }

    // init database
    if (type == 'dynamo') {
      if (this.database == null) {
        aws.config.loadFromPath(__dirname + '/../constants/config_aws.json');
        this.database = new aws.DynamoDB({
          httpOptions: {
            agent: new https.Agent({
              rejectUnauthorized: true,
              keepAlive: true
            }),
          }
        });
      }
    } else {
      logger.Log('Init Error: type not supported ' + type + ' ...');
    }

    logger.Log('ModelDatabase initialized with type ' + type);
    this.type = type;
  },

  /** API. Get database object. */
  GetDbObj: function() {
    return this.database;
  },

  /** API. Load information out of returned data from database.
   * @param {Object<string, Object<string, Object<string, string> > >} data -
   *   items returned from database, each database might have different format.
   */
  ExtractData: function(data) {
    var extracted_data = {};
    if (this.GetType() == 'dynamo') {
      for (key in data['Item']) {
        extracted_data[key] = data['Item'][key]['S'];
      }
    } else {
      logger.Log('ExtractData Error: database type not supported!');
    }
    return extracted_data;
  }
};

module.exports = ModelDatabase;
ModelDatabase.Init();
