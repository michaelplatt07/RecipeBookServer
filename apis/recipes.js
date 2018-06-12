// TODO(map) : Make more meaningful error messages here??
const debug = require('debug')('recipes');

/**
 * ----------------
 * |     GETS     |
 * ----------------
*/
/**
 * Returns all recipes that are available.
 */
exports.getRecipes = (db, req, res) => {
    debug("In getRecipes");
    query = {};
    query.searchable = true;
    db.collection("recipes").find(query).toArray((err, results) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({ title: 'All Recipes', recipes: results });
    });
}


/**
 * Returns a single recipe by name.
 */
exports.getRecipeByName = (db, req, res) => {
    debug("In getByName");
    db.collection("recipes").find({search_name: req.params.recipeName}).toArray((err, result) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });
	}
	else if (!result || result.length == 0)
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(400).send({ message: 'No recipes found by that name.' });
	}	    
	else
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ title: result['name'], recipes: result });
	}
    });
}


/**
 * The overall search call for recipes.
 */
exports.getRecipesBySearchCriteria = (db, req, res) => {
    debug("In search");
    var query = {};
    if (req.query.ingredients) { // Check if ingredient parameter was provided.
	query = {'ingredients.name': {$in: req.query.ingredients.split(' ')}};
    }
    if (req.query.course) { // Check if course parameter was provided.
	query.course = {$in: req.query.course.split(' ')};
    }
    if (req.query.submitted_by)
    {
	query.submitted_by = req.query.submitted_by;
    }
    if (req.query.cuisine)
    {
	query.cuisine = {$in: req.query.cuisine.split(' ')};
    }
    query.searchable = true;
    db.collection("recipes").find(query).toArray((err, results) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });	    
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({ title: 'Recipes', recipes: results });
    });    
};


/**
 * Return recipes based on a list of ingredients.
 */
exports.getRecipesByIngredients = (db, req, res) => {
    debug("In byIngredients");
    var query = {};
    query.searchable = true;
    if (req.query.list) {
	query.ingredients = {$in: req.query.list.split(' ')};
    }
    db.collection("recipes").find(query).toArray((err, results) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });	    
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({ title: 'Recipes', recipes: results });
    });
};


/**
 * Return recipes based on a course.
 */
exports.getRecipesByCourse = (db, req, res) => {
    debug("In byCourse");
    var query = {};
    query.searchable = true;
    if (req.query.list) {
	query.course = {$in: req.query.list.split(' ')};
    }
    db.collection("recipes").find(query).toArray((err, results) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });	    
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({ title: 'Recipes', recipes: results });
    });
};


/**
 * Returns recipes based on cuisine they are categorized to.
 */
exports.getRecipesByCuisine = (db, req, res) => {
    debug('In byCuisine');
    var query = {}
    query.searchable = true;
    if (req.query.list) {
	query.cuisine = {$in: req.query.list.split(' ')};
    }
    db.collection('recipes').find(query).toArray((err, results) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });	    
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({ title: 'Recipes', recipes: results });
    });
};


/**
 * Returns a random recipe from the collection of all recipes.
 */
exports.getRandomRecipe = (db, req, res) => {
    debug("In random");
    var query = {};
    query.searchable = true;
    db.collection("recipes").aggregate({$sample: {size: 1}}, (err, result) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });	    
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({ title: result['name'], recipe: result });
    });
};


/**
 * ----------------
 * |     PUTS     |
 * ----------------
*/
exports.addNewRecipe = (db, req, res) => {
    debug('In addNewRecipe.');
    // TODO(map) : Think about a cleaning method for the data as well.
    recipeData = req.body;
    db.collection('recipes').insertOne(recipeData, (err, result) => {
	if (err)
	{
	    res.status(500).send({ message: 'Failed to insert data.' });
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({ data: recipeData, message: 'Data successfully inserted' });
    });
};
