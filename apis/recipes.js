const utils = require('../utils/utility-functions');
const mongo = require('mongodb');
const debug = require('debug')('recipes');

const _ = require('lodash');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
/**
 * Returns all recipes that are available.
 */
exports.getRecipes = async (db, req, res) => {
    debug("In getRecipes");
    var query = {};
    query.searchable = true;

    let recipes = await db.collection("recipes").find(query).toArray();
    if (!recipes || recipes.length == 0)
    {
	return res.status(404).send({msg: 'There are currently no recipes in the database.'});
    }
    return res.status(200).send({ title: 'All Recipes', recipes: recipes });
}


/**
 * Gets a single recipe by id.
 */
exports.getRecipeById = async (db, req, res) => {
    debug("In getById");
    var query = {};
    query._id =  new mongo.ObjectID(req.params.id);
    query.searchable = true;

    let recipe = await db.collection("recipes").findOne(query);
    if (!recipe || recipe.length == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({ msg: 'There were no recipes found for the given ID.' });
    }	    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ title: recipe['name'], recipe: recipe });
}


/**
 * Returns all recipes with the given name.
 */
exports.getRecipeByName = async (db, req, res) => {
    debug("In getByName");
    var query = {};
    query.search_name =  req.params.recipeName;
    query.searchable = true;

    let recipes = await db.collection("recipes").find(query).toArray();
    if (!recipes || recipes.length == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({ msg: 'There are no recipes found by that name.' });
    }	    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ title: recipes['name'], recipes: recipes });
}


/**
 * The overall search call for recipes.
 *
 * NOTE(map) : This was originally designed to only return recipes that had all the of the searching parameters
 * but that is not how the rest of the app functioned.  For instance, cuisines returns any recipe that has
 * CuisineA or CuisineB.  The individual parts commented below actually did that too but combined they create an
 * "AND" effect instead of an "AND+OR".
 */
exports.getRecipesBySearchCriteria = async (db, req, res) => {
    debug("In search");

    var queryList = [];
    var promiseList = [];

    if (req.query.ingredients) { // Check if ingredient parameter was provided.
    	var query = {};
	query = {'ingredients.name': {$regex: req.query.ingredients.includes(" ") ? req.query.ingredients.split(" ").join("|") : req.query.ingredients.toString()}};
	queryList.push(query);
    }

    if (req.query.courses) { // Check if courses parameter was provided.
	var query = {};
	query.courses = req.query.courses.includes(" ") ? {$in: req.query.courses.split(' ')} : req.query.courses.toString();
	queryList.push(query);
    }

    if (req.query.submitted_by)
    {
	var query = {};
	query.submitted_by = req.query.submitted_by;
	queryList.push(query);
    }

    if (req.query.cuisines)
    {
	var query = {};
	query.cuisines = req.query.cuisines.includes(" ") ? {$in: req.query.cuisines.split(' ')} : req.query.cuisines.toString();
	queryList.push(query);
    }

    if (queryList.length == 0) // No search criteria was provided so return all recipes instead.
    {
	let recipes = await db.collection("recipes").find().toArray();
	if (recipes.length == 0)
	{
	    res.setHeader('Content-Type', 'application/json');
	    return res.status(404).send({ msg: 'There were no recipes found that contained all the given criteria.' });
	}	    
	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ title: 'Recipes', recipes: recipes });   
    }
    else // Search criteria was provided so do the $or query and give back results.
    {
	let recipes = await db.collection("recipes").find({ searchable: true, $or: queryList }).toArray();
	if (recipes.length == 0)
	{
	    res.setHeader('Content-Type', 'application/json');
	    return res.status(404).send({ msg: 'There were no recipes found that contained all the given criteria.' });
	}	    
	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ title: 'Recipes', recipes: recipes });
    }
    
}


/**
 * Return recipes based on a list of filterable options.
 */
exports.getRecipesByFitlerOptions = async (db, req, res) => {
    debug("In filterOptions");
    var query = {};
    query.searchable = true;

    //console.log(req.query);
    
    if (!req.query.courses && !req.query.ingredients && !req.query.cuisines) {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({ msg: 'There were no recipes found given the filter options.' });        
    }
    else {
        const queryList = [];
        for (var filter in req.query) {
            if (filter === "ingredients") {
                const formattedParams = {$regex: req.query[filter].includes(" ") ? req.query[filter].split(" ").join("|") : req.query[filter].toString()};
                const name = [filter] + '.name';
                queryList.push({[name]: formattedParams});
            }
            else {
                const formattedParams = req.query[filter].includes(" ") ? {$in: req.query[filter].split(' ')} : req.query[filter].toString();
                queryList.push({[filter]: formattedParams});
            }
        }

        let recipes = await db.collection("recipes").find({ searchable: true, $or: queryList }).toArray();
	if (recipes.length == 0)
	{
	    res.setHeader('Content-Type', 'application/json');
	    return res.status(404).send({ msg: 'There were no recipes found that contained all the given criteria.' });
	}	    
	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ title: 'Recipes', recipes: recipes });
    }
    

};


/**
 * Return recipes based on a list of ingredients.
 */
exports.getRecipesByIngredients = async (db, req, res) => {
    debug("In byIngredients");
    var query = {};
    query.searchable = true;
    if (req.query.list) {
	query = {'ingredients.name': {$in: req.query.list.split(' ')}};
    }
    else
    {
    	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'Please include one or more ingredients to filter by.'});
    }

    let recipes = await db.collection("recipes").find(query).toArray();
    if (!recipes || recipes.length == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'There were no recipes found that use those ingredients.'});
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ title: 'Recipes', recipes: recipes });
};


/**
 * Return recipes based on a courses.
 */
exports.getRecipesByCourses = async (db, req, res) => {
    debug("In byCourses");
    var query = {};
    query.searchable = true;
    if (req.query.list) {
	query.courses = req.query.list.includes(" ") ? {$in: req.query.list.split(' ')} : req.query.list.toString()
    }
    else
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'Please include one or more courses to filter by.'});
    }

    let recipes = await db.collection("recipes").find(query).toArray();
    if (!recipes || recipes.length == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'There were no recipes found for that courses.'});
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ title: 'Recipes', recipes: recipes });
};


/**
 * Returns recipes based on cuisines they are categorized to.
 */
exports.getRecipesByCuisines = async (db, req, res) => {
    debug('In byCuisines');
    var query = {}
    query.searchable = true;
    if (req.query.list) {
	query.cuisines = req.query.list.includes(" ") ? {$in: req.query.list.split(' ')} : req.query.list.toString()
    }
    else
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'Please include one or more cuisines to filter by.'});
    }
    
    let recipes = await db.collection('recipes').find(query).toArray();
    if (!recipes || recipes.length == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'There were no recipes found using that cuisines.'});
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ title: 'Recipes', recipes: recipes });
};


/**
 * Returns a random recipe from the collection of all recipes.
 */
exports.getRandomRecipe = async (db, req, res) => {
    debug("In random");
    var query = {};
    query.searchable = true;
    
    let recipes = await db.collection("recipes").aggregate([{$match: {searchable: true}}, {$sample: {size: 1}}]).toArray();
    if (!recipes || recipes.length == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'There are currently no recipes in the database.'});
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ title: recipes[0]['name'], recipe: recipes[0] });
};


/**
 * ----------------
 * |     PUTS     |
 * ----------------
 */
exports.addNewRecipe = async (db, req, res) => {
    debug('In addNewRecipe.');
    recipeData = req.body;

    var errMsgDict = utils.checkRecipePostData(recipeData);

    if (Object.keys(errMsgDict).length > 0)
    {
	res.setHeader('Content-Type', 'application/json');
     	return res.status(422).send({msg: errMsgDict});
    }
    else
    {
	recipeData['search_name'] = utils.convertTextToSearch(recipeData['text_friendly_name']);
	recipeData['short_description'] = utils.createShortDescription(recipeData['description']);

	recipeData['ingredients'].forEach((ingredient) => {
	    ingredient['name'] = utils.convertTextToSearch(ingredient['text_friendly_name']);
	})
	
	utils.insertIngredients(db, recipeData['ingredients']);

	let recipe = await db.collection('recipes').insertOne(recipeData);
	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ data: recipeData, message: 'Data successfully inserted' });
    }
};
