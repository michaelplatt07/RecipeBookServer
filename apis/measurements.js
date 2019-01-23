const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('measurements');
const Promise = require('bluebird');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
exports.getAllMeasurements = async (db, req, res) => {
    debug("In measurements");

    var query = {};
    
    let measurements = await db.collection("measurements").find(query).toArray();
    if (!measurements || measurements.length == 0)
    {
	return res.status(404).send({msg: 'There are currently no measurements in the database.'});
    }
    return res.status(200).send({ title: 'All Measurements', measurements: measurements });

};