const debug = require('debug')('ingredients');
const mongo = require('mongodb');


/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
/**
 * @swagger
 *
 * /ingredients:
 *   get:
 *     description: Gets all ingredients in the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: Returns the list of ingredients.
 *       404:
 *         NoCuisinesError: There are no ingredients in the database.
 *     example:
 *       /ingredients
 */
exports.getAllIngredients = async (db, req, res) => {
    debug("In getAllIngredients");

    var query = {};
    
    let ingredients = await db.collection("ingredients").find(query).toArray();
    if (!ingredients || ingredients.length == 0)
    {
	return res.status(404).send({msg: 'There are currently no ingredients in the database.'});
    }
    return res.status(200).send({ title: 'All Ingredients', ingredients: ingredients });

};
