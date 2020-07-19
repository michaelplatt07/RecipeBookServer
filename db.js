// MongoClient import
const MongoClient = require('mongodb').MongoClient;

const debug = require('debug')('db');

// DB config imports.
const config = require('config');
const dbUrl = 'mongodb://' + config.get('dbConfig.host');
const dbPort = config.get('dbConfig.port');
const dbName = config.get('dbConfig.name');
const appDomain = 'localhost';
const appPort = 3000;

const _ = require('lodash');

// Db JSON object that may hold more data in the future.
var dbObj = {
    db: null
};


/**
 * Attempts to connect to the database.  If a connection is already there then simply return that database
 * object and if not we attempt to conect based on the configuration specified by the NODE_ENV variable and
 * store the database object in the JSON object.
 */
exports.connect = async () => {
    if (dbObj.db)
    {
	console.log('Already connected to the database.');
    }
    
    const client = await MongoClient.connect(dbUrl + ":" + dbPort, {poolSize: 10, useUnifiedTopology: true});
    dbObj.db = client.db(dbName);
};


/**
 * Return the database object from within the JSON object.
 */
exports.getDb = () => {
    if (dbObj.db){
	return dbObj.db;
    }
    else {
	console.log("Database not currently connected.");
    }
};


exports.setDb = (db) => {
    dbObj.db = db;
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
 * Function for checking if the collection exists before dropping it so there is no error.
 */
exports.collectionExistsAndDrop = (db, collectionName) => {
    return new Promise((resolve, reject) => {
	this.collectionExists(collectionName).then(async (exists) => {
	    debug("Attempting to drop " + collectionName);
	    if (exists)
	    {
		db.getDb().dropCollection(collectionName, (err, res) => {
		    debug("Dropped " + collectionName);
		    resolve(true);
		});
	    }
	    else
	    {
		debug(collectionName + " did not exist and was not droppped.");
		resolve(false);
		}
	});
    });
};


/**
 * Drops all collections from the database.
 */
exports.dropAllCollections = () => {
    return new Promise(async (resolve,reject) => {
        try {
        const collections = await this.getDb().listCollections().toArray();
        _.forEach(collections, async (collection) => {
            await this.getDb().dropCollection(collection.name);
        });
            resolve(true);
        }
        catch(error) {
            console.log(`Error -> ${error}`);
            resolve(false);
        }
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
