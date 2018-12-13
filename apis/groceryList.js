const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('groceryList');
const Promise = require('bluebird');
const unitConverter = require('../utils/unit-converter');


/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
exports.getGroceryListByUser = async (db, req, res) => {
    debug("In getGroceryList");

    if (!req.get('userId') || req.get('userId') == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(401).send({ msg: 'There was no userId supplied.' });
    }
    else
    {
	var query = {};
	query.user =  req.get('userId');
	let groceryList = await db.collection('grocery_lists').findOne(query);
	let recipePromiseList = [];
	groceryList.recipes.forEach((recipe) => {
	    var o_id = new ObjectID(recipe);
	    recipePromiseList.push(db.collection("recipes").findOne({ '_id': o_id }));
	});
	
	let recipes = await Promise.all(recipePromiseList);
	let recipeList = []
	let groceryShoppingList = {};

	for (const recipe of recipes)
	{
	    recipeList.push(recipe);
	    for (const ingredient of recipe.ingredients)
	    {
		let dbIngredient = await db.collection('ingredients').findOne({ 'text_friendly_name': ingredient.text_friendly_name });
		if (dbIngredient['most_used_measurement'] != ingredient['measurement'])
		{
		    ingredient.quantity = unitConverter.convertMeasurement(ingredient.quantity, ingredient.measurement, dbIngredient.most_used_measurement);
		}
		if (dbIngredient['name'] in groceryShoppingList)
		{
		    groceryShoppingList[dbIngredient['name']] += ingredient.quantity;
		}
		else
		{
		    groceryShoppingList[dbIngredient['name']] = ingredient.quantity;
		}		
	    }
	}

	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ recipeList: recipeList, groceryShoppingList: groceryShoppingList });
    }
}


/**
 * ----------------
 * |     PUTS     |
 * ----------------
 */
/**
 * creates an empty grocery list for the user.
 */
exports.createNewGroceryList = async (db, req, res) => {
    debug("In newGroceryList");

    groceryList = req.body;
    let result = await db.collection('grocery_lists').insertOne(groceryList);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ data: groceryList, message: 'Data successfully inserted' });
}


/**
 * Adds a selected recipe to the grocery list for the given user.
 */
exports.addRecipeToGroceryList = async (db, req, res) => {
    debug("In addRecipeToList");

    recipeId = req.body['recipeId'];
    user = req.body['user'];

    if (!recipeId || recipeId == "")
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(422).send({ msg: 'There was no recipeId supplied.' });
    }
    else if (!user || user == "")
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(422).send({ msg: 'There was no userId supplied.' });
    }    
    else
    {
	var query = {};
	query.user = user;
	let result = await db.collection('grocery_lists').update(query, { $push: { recipes: recipeId }  });
	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ message: 'Data successfully inserted' });
    }
}


/**
 * Removes a selected recipe from the grocery list for a given user.
 */
exports.removeRecipeFromGroceryList = async (db, req, res) => {
    debug("In removeRecipeFromList");

    recipeId = req.body['recipeId'];
    user = req.body['user'];
    if (!recipeId || recipeId == "")
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(422).send({ msg: 'There was no recipeId supplied.' });
    }
    else if (!user || user == "")
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(422).send({ msg: 'There was no userId supplied.' });
    }    
    else
    {
	var query = {};
	query.user = user;
	let result = db.collection('grocery_lists').update(query, { $pull: { recipes: recipeId }  })
	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ message: 'Recipe removed from grocery list.' });
    }
}
