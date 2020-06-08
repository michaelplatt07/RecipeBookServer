const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('categories');
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
 * /categories:
 *   get:
 *     description: Gets all categories in the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: Returns the list of categories.
 *       404:
 *         NoCategoriesError: There are no categories in the database.
 *     example:
 *       /categories
 */
exports.getAllCategories = async (db, req, res) => {
    debug("In categories");

    var query = {};
    
    let categories = await db.collection("categories").find(query).toArray();
    if (!categories || categories.length == 0)
    {
	return res.status(404).send({msg: 'There are currently no categories in the database.'});
    }
    return res.status(200).send({ title: 'All Categories', categories: categories });

};
