// Node imports.
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
const app = express();

// DB import.
const db = require('./db');
db.connect();

// API imports.
const recipeApi = require('./apis/recipes.js');
const groceryListApi = require('./apis/groceryList.js');
const ingredientApi = require('./apis/ingredients.js');
const usersApi = require('./apis/users.js');
const cuisineApi = require('./apis/cuisines.js');
const courseApi = require('./apis/courses.js');
const measurementApi = require('./apis/measurements.js');


// Passport config.
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'basicSecret';

var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    const user = await db.getDb().collection('users').findOne({ username: jwt_payload.id })
    if (user) {
	next(null, user);
    } else {
	next(null, false);
    }
});

passport.use(strategy);


// Config stuff for server.
app.use(bodyParser.json());
app.use(passport.initialize());


/**
 * --------------------------------
 * |         USER ROUTING         |
 * --------------------------------
 */
/**
 * ----------------
 * |     PUTS     |
 * ----------------
 */
// Register a new user
app.post('/users/register', (req, res) => {
    usersApi.createUserAccount(db.getDb(), req, res);
});


// Delete a user.
app.get('/users/delete/:userName?', (req, res) => {
    usersApi.deleteUserAccount(db.getDb(), req, res);
})


// Register a new user
app.post('/users/login', (req, res) => {
    usersApi.loginUser(db.getDb(), req, res);
});


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


// Search for single recipe with an ID
app.get('/recipes/id/:id?', (req, res) => {
    recipeApi.getRecipeById(db.getDb(), req, res);
});


// Search recipe by criteria.
// ?ingredients=ingredient1+ingredient2+...
// ?course=course1+course2+...
// ?submitted_by=authoer
// ?cuisine=cuisine_1+cuisine_2+...
app.get('/recipes/search', (req, res) => {
    recipeApi.getRecipesBySearchCriteria(db.getDb(), req, res);
});


// Filter recipes by up to 3 options.
// Object for filtering should be formatted like so:
/*
 * { 
 * FILTEROPTION1: [OPTION1, OPTION2, ...],
 * FILTEROPTION2: {OPTION3, OPTION4, ...],
 * }
 */
app.get('/recipes/filter', (req, res) => {
    recipeApi.getRecipesByFitlerOptions(db.getDb(), req, res);
});


// Recipe by any number of ingredients
// ?list=1+2+3...
app.get('/recipes/ingredients', (req, res) => {
    recipeApi.getRecipesByIngredients(db.getDb(), req, res);
});


// Recipe by course search
// ?list=1+2+3...
app.get('/recipes/courses', (req, res) => {
    recipeApi.getRecipesByCourses(db.getDb(), req, res);
});


// Recipe by cuisine
// ?list=1+2+3...
app.get('/recipes/cuisines', (req, res) => {
    recipeApi.getRecipesByCuisines(db.getDb(), req, res);
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
app.post('/recipes/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    recipeApi.addNewRecipe(db.getDb(), req, res);
});


/**
 * --------------------------------
 * |     GROCERY LIST ROUTING     |
 * --------------------------------
 */
/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
app.get('/groceryList',
	passport.authenticate('basic', { session: false }),
	(req, res) => {
	    groceryListApi.getGroceryListByUser(db.getDb(), req, res);
	});


/**
 * ----------------
 * |     PUTS     |
 * ----------------
 */
// Add new grocery list.
app.post('/groceryList/add',
	 passport.authenticate('basic', { session: false }),
	 (req, res) => {
	     groceryListApi.createNewGroceryList(db.getDb(), req, res);
	 });


// Add recipe to grocery list.
app.post('/groceryList/addRecipe',
	 passport.authenticate('basic', { session: false }),
	 (req, res) => {
	     groceryListApi.addRecipeToGroceryList(db.getDb(), req, res);
	 });


// Remove recipe from grocery list.
app.post('/groceryList/removeRecipe',
	 passport.authenticate('basic', { session: false }),
	 (req, res) => {
	     groceryListApi.removeRecipeFromGroceryList(db.getDb(), req, res);
	 });



/**
 * --------------------------------
 * |      INGREDIENT ROUTING      |
 * --------------------------------
 */
/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
app.get('/ingredients', (req, res) => {
    ingredientApi.getAllIngredients(db.getDb(), req, res);
});


/**
 * --------------------------------
 * |       CUISINE ROUTING        |
 * --------------------------------
 */
/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
app.get('/cuisines', (req, res) => {
    cuisineApi.getAllCuisines(db.getDb(), req, res);
});



/**
 * --------------------------------
 * |        COURSE ROUTING        |
 * --------------------------------
 */
/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
app.get('/courses', (req, res) => {
    courseApi.getAllCourses(db.getDb(), req, res);
});



/**
 * --------------------------------
 * |     MEASUREMENT ROUTING      |
 * --------------------------------
 */
/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
app.get('/measurements', (req, res) => {
    measurementApi.getAllMeasurements(db.getDb(), req, res);
});



module.exports = app;
