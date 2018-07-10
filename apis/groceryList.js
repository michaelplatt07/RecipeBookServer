const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('recipes');
const Promise = require('bluebird');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
exports.getGroceryListByUser = (db, req, res) => {
    debug("In getGroceryList");

    if (!req.get('userId') || req.get('userId') == 0)
    {
	res.status(401).send({ msg: 'There was no userId supplied.' });
    }
    else
    {
	var query = {};
	query.user =  req.get('userId');
	db.collection('grocery_lists').findOne(query, (err, result) => {
	    if (err)
	    {
		res.status(500).send({ message: 'Failed to retrieve data' });
	    }

	    recipePromiseList = []
	    result.recipes.forEach((recipe) => {
		var o_id = new ObjectID(recipe);
		recipePromiseList.push(db.collection("recipes").findOne({ '_id': o_id }));
	    });
	    
	    Promise.all(recipePromiseList).then((values) => {
		recipeList = []
		groceryList = {};
		values.forEach(value => {
		    recipeList.push(value);
		    value.ingredients.forEach(ingredient => {
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
		res.status(200).send({ recipeList: recipeList, groceryList: groceryList });
	    });
	});
    }
}


/**
 * ----------------
 * |     PUTS     |
 * ----------------
*/
exports.createNewGroceryList = (db, req, res) => {
    debug("In newGroceryList");

    groceryList = req.body;
    db.collection('grocery_lists').insertOne(groceryList, (err, result) => {
	if (err)
	{
	    res.status(500).send({ message: 'Failed to insert data' });
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({ data: groceryList, message: 'Data successfully inserted' });
    });
}


exports.addRecipeToGroceryList = (db, req, res) => {
    debug("In addRecipeToList");

    recipeId = req.body['recipeId'];
    user = req.body['user'];

    if (!recipeId || recipeId == "")
    {
	res.status(422).send({ msg: 'There was no recipeId supplied.' });
    }
    else if (!user || user == "")
    {
	res.status(422).send({ msg: 'There was no userId supplied.' });
    }    
    else
    {
	var query = {};
	query.user = user;
	db.collection('grocery_lists').update(query, { $push: { recipes: recipeId }  },  (err, result) => {
	    if (err)
	    {
		res.status(500).send({ message: 'Failed to insert data' });
	    }
	    res.status(200).send({ message: 'Data successfully inserted' });
	});
    }
}


exports.removeRecipeFromGroceryList = (db, req, res) => {
    debug("In removeRecipeFromList");

    recipeId = req.body['recipeId'];
    user = req.body['user'];
    if (!recipeId || recipeId == "")
    {
	res.status(422).send({ msg: 'There was no recipeId supplied.' });
    }
    else if (!user || user == "")
    {
	res.status(422).send({ msg: 'There was no userId supplied.' });
    }    
    else
    {
	var query = {};
	query.user = user;
	db.collection('grocery_lists').update(query, { $pull: { recipes: recipeId }  },  (err, result) => {
	    if (err)
	    {
		res.status(500).send({ message: 'Failed to remove the recipe from the grocery list.' });
	    }
	    res.status(200).send({ message: 'Recipe removed from grocery list.' });
	});
    }
}
