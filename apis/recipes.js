const utils = require('../utils/utility-functions');
const mongo = require('mongodb');
const jwt = require('jsonwebtoken');
const debug = require('debug')('recipes');

const _ = require('lodash');
const {spawn} = require('child_process');
const path = require('path');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
/**
 * @swagger
 *
 * /recipes:
 *   get:
 *     description: Returns all recipes that are available
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database and they will be returned.
 *       404:
 *         NoRecipesError: There were no recipes in the database.
 *     example:
 *       /recipes
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
};


exports.importRecipes = async (db, req, res) => {
	debug("In importRecipes");
	const pythonProcess = spawn('python', [path.join(__dirname, '..', 'scrapers/all_recipes_scraper.py')]);
	pythonProcess.stdout.on('data', (scraped_recipe) => {
		return res.status(200).send({ recipeData: scraped_recipe.toString() });
	});
};

/**
 * @swagger
 *
 * /recipes/id/:id?:
 *   get:
 *     description: Gets a single recipe based on the Mongo ObjectID
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: id
 *         description: The Mongo ObjectID of the recipe that is created on insert.
 *         in: URL parameters
 *         require: true
 *         type: String
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database and they will be returned.
 *       404:
 *         NoMatchesError: There were no recipes in the database.
 *     example:
 *       /recipes/id/1234
 */
exports.getRecipeById = async (db, req, res) => {
    debug("In getById");
    debug(`ID value -> ${req.params.id}`);

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
};


/**
 * @swagger
 *
 * /recipes/name/:recipeName?:
 *   get:
 *     description: Gets any recipes that match the name of the search parameter passed in.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: recipeName
 *         description: The name of a recipe for which you want to return.
 *         in: URL parameters
 *         require: true
 *         type: String
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database whose name matches the search paraemter.
 *       404:
 *         NoMatchesError: There were no recipes whose name matches the searched parameter passed in.
 *     example:
 *       /recipes/name/SampleRecipe
 */
exports.getRecipeByName = async (db, req, res) => {
    debug("In getByName");
    debug(`Recipe name -> ${req.params.recipeName}`);

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
};


/**
 * @swagger
 *
 * /recipes/search:
 *   get:
 *     description: Gets any recipes that have any fields that match the search parameters that were passed in.  
 *                  Note that this searches across 4 fields that include ingredients, courses, cuisines, and 
 *                  submitted by with any search parameters passed in an returns any matches.  If no parameters are
 *                  passed in then the search defaults to getting all recipes.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: searchParams
 *         description: The parameters for which you want to search.
 *         in: Query parameters
 *         require: false
 *         type: String
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database that had a field that matched the search parameters.
 *       404:
 *         NoMatchesError: There were no recipes that matched the search criteria.
 *         NoRecipesError: There were no recipes in the database.
 *     example:
 *       /recipes/search?searchParams=Param1+Param2+...+ParamN
 */
exports.getRecipesBySearchCriteria = async (db, req, res) => {
    debug("In search");
    debug(`Search Parameters -> ${req.query.searchParams}`);
    
    if (!req.query.searchParams) {
	let recipes = await db.collection("recipes").find().toArray();
	if (recipes.length == 0)
	{
	    res.setHeader('Content-Type', 'application/json');
	    return res.status(404).send({ msg: 'There were no recipes found that contained all the given criteria.' });
	}	    
	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ title: 'Recipes', recipes: recipes });           
    }
    else {    
        const ingredientQuery = {'ingredients.name': {$regex: req.query.searchParams.includes(" ") ? req.query.searchParams.split(" ").join("|") : req.query.searchParams.toString()}};
        const cuisineQuery = {cuisines: req.query.searchParams.includes(" ") ? {$in: req.query.searchParams.split(' ')} : req.query.searchParams.toString()};
        const courseQuery = {courses: req.query.searchParams.includes(" ") ? {$in: req.query.searchParams.split(' ')} : req.query.searchParams.toString()};
        const submittedByQuery = {submitted_by: req.query.searchParams.includes(" ") ? {$in: req.query.searchParams.split(' ')} : req.query.searchParams.toString()};
        const queryList = [ingredientQuery, cuisineQuery, courseQuery, submittedByQuery];

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
 * @swagger
 *
 * /recipes/filter:
 *   get:
 *     description: Method for filtering based on course, cuisine, or ingredients.  This differs from the search in
 *                  that it won't explicitly search across all three options.  If one of the options is not included
 *                  it won't be used.  In that regards this is a generally a faster way to look things up.  Like the 
 *                  search method if nothing is passed it will bring back all recipes.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: cuisines
 *         description: The cuisines that you want to filter on.
 *         in: Query parameters
 *         require: false
 *         type: String
 *       - name: courses
 *         description: The courses for which you want to filter on.
 *         in: Query parameters
 *         require: false
 *         type: String
 *       - name: ingredients
 *         description: The ingredients for which you want to filter on.
 *         in: Query parameters
 *         require: false
 *         type: String
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database that have some fields that match up with the filter
 *                  options.
 *       404:
 *         Error: There were no recipes in the database.
 *     example:
 *       /recipes/filter?ingredients=Ingredient1+Ingredient2+...+IngredientN
 *                      &cuisines=Cuisine1+Cuisine2+...+CuisineN
 *                      &courses=Course1+Course2+...+CourseN
 */
exports.getRecipesByFitlerOptions = async (db, req, res) => {
    debug("In filterOptions");
    debug(`Fitler options -> Cuisines: ${req.query.cuisines}`);
    debug(`Fitler options -> Courses: ${req.query.courses}`);
    debug(`Fitler options -> Ingredients: ${req.query.ingredients}`);

    var query = {};
    query.searchable = true;
    
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
 * @swagger
 *
 * /recipes/ingredients:
 *   get:
 *     description: Searches for recipes that have specific ingredients.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: list
 *         description: The list of ingredients that will be used to search.
 *         in: Query parameters
 *         require: true
 *         type: String
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database that have some fields that match up with the filter
 *                  options.
 *       404:
 *         NoIngredientsError: There were no ingredients passed in to search by.
 *         NoMatchesError: There were no recipes that matches any of the ingredients passed in.
 *     example:
 *       /recipes/ingredients?list=Ingredient1+Ingredient2+...+IngredientN
 */
exports.getRecipesByIngredients = async (db, req, res) => {
    debug("In byIngredients");
    debug(`Ingredients -> ${req.query.list}`);

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
 * @swagger
 *
 * /recipes/courses:
 *   get:
 *     description: Searches for recipes that have specific courses.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: list
 *         description: The list of courses that will be used to search.
 *         in: Query parameters
 *         require: true
 *         type: String
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database that have some fields that match up with the filter
 *                  options.
 *       404:
 *         NoCoursesError: There were no courses passed in to search by.
 *         NoMatchesError: There were no recipes that matches any of the courses passed in.
 *     example:
 *       /recipes/courses?list=Ingredient1+Ingredient2+...+IngredientN
 */
exports.getRecipesByCourses = async (db, req, res) => {
    debug("In byCourses");
    debug(`Courses -> ${req.query.list}`);

    var query = {};
    query.searchable = true;
    if (req.query.list) {
	query.courses = req.query.list.includes(" ") ? {$in: req.query.list.split(' ')} : req.query.list.toString();
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
 * @swagger
 *
 * /recipes/cuisines:
 *   get:
 *     description: Searches for recipes that have specific cuisines.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: list
 *         description: The list of cuisines that will be used to search.
 *         in: Query parameters
 *         require: true
 *         type: String
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database that have some fields that match up with the filter
 *                  options.
 *       404:
 *         NoCuisinesError: There were no cuisines passed in to search by.
 *         NoMatchesError: There were no recipes that matches any of the cuisines passed in.
 *     example:
 *       /recipes/cuisines?list=Ingredient1+Ingredient2+...+IngredientN
 */
exports.getRecipesByCuisines = async (db, req, res) => {
    debug('In byCuisines');
    debug(`Cuisines -> ${req.query.list}`);

    var query = {};
    query.searchable = true;
    if (req.query.list) {
	query.cuisines = req.query.list.includes(" ") ? {$in: req.query.list.split(' ')} : req.query.list.toString();
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
 * @swagger
 *
 * /recipes/categories:
 *   get:
 *     description: Searches for recipes that have specific categories.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: list
 *         description: The list of categories that will be used to search.
 *         in: Query parameters
 *         require: true
 *         type: String
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database that have some fields that match up with the filter
 *                  options.
 *       404:
 *         NoCategoriesError: There were no categories passed in to search by.
 *         NoMatchesError: There were no recipes that matches any of the categories passed in.
 *     example:
 *       /recipes/cateogires?list=Category1+Category2+...+CategoryN
 */
exports.getRecipesByCategories = async (db, req, res) => {
    debug('In byCategories');
    debug(`Categories -> ${req.query.list}`);

    var query = {};
    query.searchable = true;
    if (req.query.list) {
	query.categories = req.query.list.includes(" ") ? {$in: req.query.list.split(' ')} : req.query.list.toString();
    }
    else
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'Please include one or more categories to filter by.'});
    }
    
    let recipes = await db.collection('recipes').find(query).toArray();
    if (!recipes || recipes.length == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send({msg: 'There were no recipes found using that categories.'});
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ title: 'Recipes', recipes: recipes });
};


/**
 * @swagger
 *
 * /recipes/random:
 *   get:
 *     description: Pulls a random recipe from the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: There was a random recipe that could be pulled back.
 *       404:
 *         NoRecipesError: There are no recipes in the database.
 *     example:
 *       /recipes/random
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
/**
 * @swagger
 *
 * /recipes/add:
 *   post:
 *     description: Adds a new recipe to the database.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: text_friendly_name
 *         description: The name of the recipe as a user would read it.
 *         in: Form Body
 *         require: true
 *         type: String
 *       - name: ingredients
 *         description: The list of ingredients.  Each one must contain a name, quantity, and measurement field.
 *         in: Form Body
 *         require: true
 *         type: List of JSON objects
 *       - name: steps
 *         description: The list of steps required to execute the recipe.
 *         in: Form Body
 *         require: true
 *         type: List of Strings
 *       - name: courses
 *         description: The list of courses the recipe can be classified as.
 *         in: Form Body
 *         require: true
 *         type: List of Strings
 *       - name: prep_time
 *         description: The time it takes, in minutes, to prep the ingredients for the recipes.
 *         in: Form Body
 *         require: true
 *         type: int
 *       - name: cook_time
 *         description: The time it takes, in minutes, to cook the recipe.
 *         in: Form Body
 *         require: true
 *         type: int
 *       - name: cuisines
 *         description: The list of cuisines the recipe can be classified on.
 *         in: Form Body
 *         require: true
 *         type: List of Strings
 *       - name: categories
 *         description: The list of categories the recipe can be classified on.
 *         in: Form Body
 *         require: true
 *         type: List of Strings
 *       - name: serving_sizes
 *         description: The amount of servings the dish makes.
 *         in: Form Body
 *         require: true
 *         type: string
 *       - name: submitted_by
 *         description: The User that is submitting the recipe.
 *         in: Form Body
 *         require: true
 *         type: List of Strings
 *       - name: searchable
 *         description: Boolean representing if the recipe is public facing or not.
 *         in: Form Body
 *         require: true
 *         type: boolean
 *     responses:
 *       200:
 *         Success: Recipe was successfully inserted.
 *       422:
 *         UnprocessableEntityError: There are one or more of the required fields missing.  The errors are returned
 *                                   as a dictionary with more specific error names and descriptions of what is 
 *                                   missing.
 *     example:
 *       /recipes/add
 */
exports.addNewRecipe = async (db, req, res) => {
    debug('In addNewRecipe.');
    const recipeData = req.body;
    
    // Creating a rating field for the recipe.
    recipeData.rating = 0;
    recipeData.submitted_by = jwt.decode(req.get('Authorization').replace('JWT ', '').toString()).id;
    
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
	});

        if (!recipeData['chef_notes']) {
            recipeData['chef_notes'] = '';
        }
        
	utils.insertIngredients(db, recipeData['ingredients']);

	let recipe = await db.collection('recipes').insertOne(recipeData);
	res.setHeader('Content-Type', 'application/json');
	return res.status(200).send({ data: recipeData, message: 'Data successfully inserted' });
    }
};


/**
 * @swagger
 *
 * /recipes/rating/update/:id?:
 *   post:
 *     description: Updates the rating of a recipe in the database.
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: id
 *         description: The Mongo ObjectID of the recipe to be updated.
 *         in: URL parameters
 *         require: true
 *         type: String
 *       - name: rating
 *         description: The new rating to be averaged in.
 *         in: body
 *         require: true
 *         type: int
 *     responses:
 *       200:
 *         Success: There was one or more recipes in the database and they will be returned.
 *       404:
 *         NoMatchesError: There were no recipes with that ID in the database.
 *     example:
 *       /recipes/rating/update/1234
 */
exports.updateRecipeRating = async (db, req, res) => {
    if (!req.body.rating) {
        res.setHeader('Content-Type', 'application/json');
     	return res.status(422).send({msg: 'There was no rating sent in the body.'});
    }
    else {
        const query = {};
        query._id =  new mongo.ObjectID(req.params.id);
        let recipe = await db.collection("recipes").findOne(query);
        if (!recipe)
        {
	    return res.status(404).send({msg: 'No recipes exist that match that ID.'});
        }
        else
        {
            const averagedRating = recipe.rating === 0 ? req.body.rating : ((recipe.rating + req.body.rating) / 2);
            const newValues = { $set: { rating: averagedRating }};
            recipe.rating = averagedRating;
            await db.collection('recipes').updateOne(query, newValues);
            return res.status(200).send({ data: recipe });
        }
    }
};
