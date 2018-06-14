// Node imports.
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// DB import.
const db = require('./db');
db.connect();

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
/**
 * ----------------
 * |     GETS     |
 * ----------------
*/
// All recipes
app.get('/recipes', (req, res) => {
    recipeApi.getRecipes(db.getDb(), req, res);
});


// Search recipe by criteria.
// ?ingredients=ingredient1+ingredient2+...
// ?course=course1+course2+...
// ?submitted_by=authoer
// ?cuisine=cuisine_1+cuisine_2+...

app.get('/recipes/search', (req, res) => {
    recipeApi.getRecipesBySearchCriteria(db.getDb(), req, res);
});


// Recipe by any number of ingredients
// ?list=1+2+3...
app.get('/recipes/ingredients', (req, res) => {
    recipeApi.getRecipesByIngredients(db.getDb(), req, res);
});


// Recipe by course search
// ?list=1+2+3...
app.get('/recipes/course', (req, res) => {
    recipeApi.getRecipesByCourse(db.getDb(), req, res);
});


// Recipe by cuisine
// ?list=1+2+3...
app.get('/recipes/cuisine', (req, res) => {
    recipeApi.getRecipesByCuisine(db.getDb(), req, res);
});


// Random recipe
app.get('/recipes/random', (req, res) => {
    recipeApi.getRandomRecipe(db.getDb(), req, res);
});


// Recipe by search_name
app.get('/recipes/name/:recipeName?', (req, res) => {
    recipeApi.getRecipeByName(db.getDb(), req, res);
});


/**
 * ----------------
 * |     PUTS     |
 * ----------------
*/
// Add new Recipe.
app.post('/recipes/add', (req, res) => {
    recipeApi.addNewRecipe(db.getDb(), req, res);
});


/**
 * --------------------------------
 * |     GROCERY LIST ROUTING     |
 * --------------------------------
 */
app.get('/groceryList', (req, res) => {
    groceryListApi.getGroceryListByUser(db.getDb(), req, res);
});


// Add new grocery list.
app.post('/groceryList/add', (req, res) => {
    groceryListApi.createNewGroceryList(db.getDb(), req, res);
});


// Add recipe to grocery list.
app.post('/groceryList/addRecipe', (req, res) => {
    groceryListApi.addRecipeToGroceryList(db.getDb(), req, res);
});


// Remove recipe from grocery list.
app.post('/groceryList/removeRecipe', (req, res) => {
    groceryListApi.removeRecipeFromGroceryList(db.getDb(), req, res);
});

module.exports = app;
