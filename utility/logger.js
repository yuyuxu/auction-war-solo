var bunyan = require('bunyan');


/**
 * Current model contains: db, vm, model, ctrl
 */
ModuleLogger = {
	loggers : {},

	CreateLogger : function (type) {
		var logger = bunyan.createLogger({
			name: type,
			streams : [
				{
					level: 'info',
					path : './bin/bunyan.log'
					//stream: process.stdout
				}
			]
		});
		this.loggers[type] = logger;
	},

	GetLogger : function (type) {
		if (this.loggers[type] == null) ModuleLogger.CreateLogger(type);
		return ModuleLogger.loggers[type];
	},
}
module.exports = ModuleLogger;