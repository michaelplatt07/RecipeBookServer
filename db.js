// MongoClient import
const MongoClient = require('mongodb').MongoClient;

// DB config imports.
const config = require('config');
const dbUrl = 'mongodb://' + config.get('dbConfig.host');
const dbPort = config.get('dbConfig.port');
const dbName = config.get('dbConfig.name');
const appDomain = 'localhost';
const appPort = 3000;

// Db JSON object that may hold more data in the future.
var dbObj = {
    db: null
}


/**
 * Attempts to connect to the database.  If a connection is already there then simply return that database
 * object and if not we attempt to conect based on the configuration specified by the NODE_ENV variable and
 * store the database object in the JSON object.
 */
exports.connect = () => {
    if (dbObj.db) return ;

    MongoClient.connect(dbUrl + ":" + dbPort + "/" + dbName, {poolSize: 10}, function(err, database) {
	if(err) throw err;

	dbObj.db = database; // Set the db variable for reuse.
	
	return;
    });
    
};


/**
 * Return the database object from within the JSON object.
 */
exports.getDb = () => {
    if (dbObj.db){
	return dbObj.db;
    }
    else {
	console.log("Database not currently connect.");
    }
};


/**
 * Function for checking if a collection exists.
 */
exports.collectionExists = (collectionName) => {
    return new Promise((resolve, reject) => {
	this.getDb().listCollections().toArray((err, colls) => {
	    if (err) reject(err);
	    for (let i = 0; i < colls.length; ++i) {
		if (colls[i]['name'] === collectionName) {
		    resolve(true);
		}
	    }
	    resolve(false);
	});
    });
};


/**
 * Utility function to close the database connection manually if needed.
 */
exports.close = (done) => {
    if (dbObj.db) {
	dbObj.db.close();
    }
};
