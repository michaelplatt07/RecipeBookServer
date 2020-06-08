const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('measurements');
const Promise = require('bluebird');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
/**
 * @swagger
 *
 * /measurements:
 *   get:
 *     description: Gets all measurements in the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: Returns the list of measurements.
 *       404:
 *         NoCuisinesError: There are no measurements in the database.
 *     example:
 *       /measurements
 */
exports.getAllMeasurements = async (db, req, res) => {
    debug("In measurements");

    var query = {};
    
    let measurements = await db.collection("measurements").find(query).toArray();
    // TODO(map) : Do I really want to return a 404 error here?  I feel like logging that there are no measurements
    // is probably just better for me since it's possible to have this happen.
    if (!measurements || measurements.length == 0)
    {
	return res.status(404).send({msg: 'There are currently no measurements in the database.'});
    }
    return res.status(200).send({ title: 'All Measurements', measurements: measurements });

};
