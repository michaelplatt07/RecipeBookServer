const utils = require('../utils/utility-functions');
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
	else if (!results || results.length == 0)
	{
	    res.status(404).send({msg: 'There are currently no recipes in the database.'});
	}
	else
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ title: 'All Recipes', recipes: results });
	}
    });
}


/**
 * Returns a single recipe by name.
 */
exports.getRecipeByName = (db, req, res) => {
    debug("In getByName");
    var query = {};
    query.search_name =  req.params.recipeName;
    query.searchable = true;

    db.collection("recipes").find(query).toArray((err, results) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });
	}
	else if (!results || results.length == 0)
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(404).send({ msg: 'There are no recipes found by that name.' });
	}	    
	else
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ title: results['name'], recipes: results });
	}
    });
}


/**
 * The overall search call for recipes.
 *
 * NOTE(map) : This was originally designed to only return recipes that had all the of the searching parameters
 * but that is not how the rest of the app functioned.  For instance, cuisine returns any recipe that has
 * CuisineA or CuisineB.  The individual parts commented below actually did that too but combined they create an
 * "AND" effect instead of an "AND+OR".
 */
exports.getRecipesBySearchCriteria = (db, req, res) => {
    debug("In search");
        // NOTE(map) : Original code here in case I want to revert.
    /*
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
      else if (!results || results.length == 0)
      {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).send({ msg: 'There were no recipes found that contained all the given criteria.' });
      }	    
      else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send({ title: 'Recipes', recipes: results });
      }
      });    
    */

    var queryPromiseList = [];
    
    // Create a series of promises that will be joined later.
    if (req.query.ingredients) { // Check if ingredient parameter was provided.
	var query = {};
	query.searchable = true;
	query = {'ingredients.name': {$in: req.query.ingredients.split(' ')}};
	queryPromiseList.push(db.collection("recipes").find(query).toArray());
    }

    if (req.query.course) { // Check if course parameter was provided.
	var query = {};
	query.searchable = true;
	query.course = {$in: req.query.course.split(' ')};
	queryPromiseList.push(db.collection("recipes").find(query).toArray());
    }

    if (req.query.submitted_by)
    {
	var query = {};
	query.searchable = true;
	query.submitted_by = req.query.submitted_by;
	queryPromiseList.push(db.collection("recipes").find(query).toArray());
    }

    if (req.query.cuisine)
    {
	var query = {};
	query.searchable = true;
	query.cuisine = {$in: req.query.cuisine.split(' ')};
	queryPromiseList.push(db.collection("recipes").find(query).toArray());
    }

    Promise.all(queryPromiseList).then((values) => {
	var recipeList = [];
	for(let i = 0; i < values.length; ++i)
	{
	    for(let j = 0; j < values[i].length; ++j)
	    {
		if (!utils.mongoIdInArray(values[i][j]['_id'], recipeList))
		{
		    recipeList.push(values[i][j]);
		}
	    }
	}

	if (recipeList.length == 0)
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(404).send({ msg: 'There were no recipes found that contained all the given criteria.' });
	}	    
	else {
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ title: 'Recipes', recipes: recipeList });
	}

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
	query = {'ingredients.name': {$in: req.query.list.split(' ')}};
    }

    db.collection("recipes").find(query).toArray((err, results) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });	    
	}
	else if (!results || results.length == 0)
	{
	    res.status(404).send({msg: 'There were no recipes found that use those ingredients.'});
	}
	else
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ title: 'Recipes', recipes: results });
	}
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
	else if (!results || results.length == 0)
	{
	    res.status(404).send({msg: 'There were no recipes found for that course.'});
	}
	else
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ title: 'Recipes', recipes: results });
	}
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
	else if (!results || results.length == 0)
	{
	    res.status(404).send({msg: 'There were no recipes found using that cuisine.'});
	}
	else {
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ title: 'Recipes', recipes: results });
	}
    });
};


/**
 * Returns a random recipe from the collection of all recipes.
 */
exports.getRandomRecipe = (db, req, res) => {
    debug("In random");
    var query = {};
    query.searchable = true;
    db.collection("recipes").aggregate({$sample: {size: 1}}, (err, results) => {
	if (err)
	{
	    res.status(500).send({ message: 'Something went wrong.' });	    
	}
	else if (!results || results.length == 0)
	{
	    res.status(404).send({msg: 'There are currently no recipes in the database.'});
	}
	else
	{
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ title: results[0]['name'], recipe: results[0] });
	}
    });
};


/**
 * ----------------
 * |     PUTS     |
 * ----------------
 */
exports.addNewRecipe = (db, req, res) => {
    debug('In addNewRecipe.');
    recipeData = req.body;

    var errMsgDict = utils.checkRecipePostData(recipeData);

    if (Object.keys(errMsgDict).length > 0)
    {
	res.status(422).send({msg: errMsgDict});
    }
    else
    {
	recipeData['search_name'] = utils.convertTextToSearch(recipeData['text_friendly_name']);
	utils.insertIngredients(db, recipeData['ingredients']);
	db.collection('recipes').insertOne(recipeData, (err, result) => {
	    if (err)
	    {
		res.status(500).send({ message: 'Failed to insert data.' });
	    }
	    res.setHeader('Content-Type', 'application/json');
	    res.status(200).send({ data: recipeData, message: 'Data successfully inserted' });
	});
    }
};
