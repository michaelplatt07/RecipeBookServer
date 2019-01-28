const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('cuisines');
const Promise = require('bluebird');
const unitConverter = require('../utils/unit-converter');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
/**
 * @swagger
 *
 * /cuisines:
 *   get:
 *     description: Gets all cuisines in the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: Returns the list of cuisines.
 *       404:
 *         NoCuisinesError: There are no cuisines in the database.
 *     example:
 *       /cuisines
 */
exports.getAllCuisines = async (db, req, res) => {
    debug("In cuisines");

    var query = {};
    
    let cuisines = await db.collection("cuisines").find(query).toArray();
    if (!cuisines || cuisines.length == 0)
    {
	return res.status(404).send({msg: 'There are currently no cuisines in the database.'});
    }
    return res.status(200).send({ title: 'All Cuisines', cuisines: cuisines });

};
