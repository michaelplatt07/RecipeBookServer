const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('recipes');
const Promise = require('bluebird');


// TODO(map) : Update to use async/ await
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
	recipePromiseList = []
	groceryList.recipes.forEach((recipe) => {
	    var o_id = new ObjectID(recipe);
	    recipePromiseList.push(db.collection("recipes").findOne({ '_id': o_id }));
	});
	
	let recipes = Promise.all(recipePromiseList);
	recipeList = []
	groceryList = {};
	recipes.forEach(recipe => {
	    recipeList.push(recipe);
	    recipe.ingredients.forEach(ingredient => {
		// Ingredient is in shopping list.
		if (ingredient['name'] in groceryList) {
		    // Measurements are the same.
		    /*
		     * When a user inserts a recipe, check if the ingredient exists in the ingredient collection
		     * If no -> simply add along with type of measurement
		     * If yes -> calculate percentage of people using measurement and store info.
		     */
		    if (ingredient['measurement'] == groceryList[ingredient['measurement']])
		    {
			groceryList[ingredient['name']]['quantity'] += ingredient['quantity'];
		    }
		}
		// Ingredient isn't already in shopping list.
		else {
		    groceryList[ingredient['name']] = ingredient;
		}
	    });
	});

	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ recipeList: recipeList, groceryList: groceryList });
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
