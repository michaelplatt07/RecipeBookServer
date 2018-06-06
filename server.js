// Node imports.
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// App Config variables
const config = require('config');
const dbUrl = 'mongodb://' + config.get('dbConfig.host');
const dbPort = config.get('dbConfig.port');
const dbName = config.get('dbConfig.name');
const appDomain = 'localhost';
const appPort = 3000;

var db; // Variable for managing database connection pool.

// API imports.
var recipeApi = require('./apis/recipes.js');
var groceryListApi = require('./apis/groceryList.js');


// Config stuff for server.
app.use(bodyParser.json());


/**
 * --------------------------
 * |     RECIPE ROUTING     |
 * --------------------------
*/
// All recipes
app.get('/recipes', (req, res) => {
    recipeApi.getRecipes(db, req, res);
});


// Search recipe by criteria.
app.get('/recipes/search', (req, res) => {
    recipeApi.getRecipesBySearchCriteria(db, req, res);
});


// Recipe by any number of ingredients
// ?list=1+2+3...
app.get('/recipes/ingredients', (req, res) => {
    recipeApi.getRecipesByIngredients(db, req, res);
});


// Recipe by course search
// ?list=1+2+3...
app.get('/recipes/course', (req, res) => {
    recipeApi.getRecipesByCourse(db, req, res);
});


// Recipe by cuisine
// ?list=1+2+3...
app.get('/recipes/cuisine', (req, res) => {
    recipeApi.getRecipesByCuisine(db, req, res);
});

// Random recipe
app.get('/recipes/random', (req, res) => {
    recipeApi.getRandomRecipe(db, req, res);
});


// Add new Recipe.
app.post('/recipes/add', (req, res) => {
    recipeApi.addNewRecipe(db, req, res);
});


// Recipe by search_name
// ?list=1+2+3...
app.get('/recipes/:recipeName?', (req, res) => {
    recipeApi.getRecipeByName(db, req, res);
});


/**
 * --------------------------------
 * |     GROCERY LIST ROUTING     |
 * --------------------------------
 */
app.get('/groceryList', (req, res) => {
    groceryListApi.getGroceryListByUser(db, req, res);
});


// Add new grocery list.
app.post('/groceryList/add', (req, res) => {
    groceryListApi.createNewGroceryList(db, req, res);
});


// Add recipe to grocery list.
app.post('/groceryList/addRecipe', (req, res) => {
    groceryListApi.addRecipeToGroceryList(db, req, res);
});


// Remove recipe from grocery list.
app.post('/groceryList/removeRecipe', (req, res) => {
    groceryListApi.removeRecipeFromGroceryList(db, req, res);
});


// Start connection pool for mongodb and also start the server.
MongoClient.connect(dbUrl + ":" + dbPort + "/" + dbName, {poolSize: 10}, function(err, database) {
    if(err) throw err;

    db = database; // Set the db variable for reuse.
    
    app.listen(appPort, () => {
	console.log('Server listening on http://localhost:' + appPort);
    });

});

module.exports = app;
