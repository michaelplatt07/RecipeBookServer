const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('servingSizes');
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
 * /servingSizes:
 *   get:
 *     description: Gets all serving sizes in the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: Returns the list of serving sizes.
 *       404:
 *         NoServingSizesError: There are no serving sizes in the database.
 *     example:
 *       /servingSizes
 */
exports.getAllServingSizes = async (db, req, res) => {
    debug("In servingSizes");

    var query = {};
    
    let servingSizes = await db.collection("serving_sizes").find(query).toArray();
    if (!servingSizes || servingSizes.length == 0)
    {
	return res.status(404).send({msg: 'There are currently no servingSizes in the database.'});
    }
    return res.status(200).send({ title: 'All ServingSizes', servingSizes: servingSizes });

};
