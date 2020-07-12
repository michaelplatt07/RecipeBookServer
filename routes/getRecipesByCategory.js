const recipesApi = require('../apis/recipes');
const debug = require('debug')('getRecipesByCategory');
const db = require('../db');

module.exports.getRecipesByCategory = async (req, res) => {
    console.log(`Query params: ${req.query.list}`);
    // return res.status(200).send([{name: "ASDF"}, {name: "JKL"}]);

    debug(`Categories -> ${req.query.list}`);

    var query = {};
    query.searchable = true;
    if (req.query.list) {
	query.categories = req.query.list.includes(" ") ? {$in: req.query.list.split(' ')} : req.query.list.toString();
    }
    
    let recipes = await db.getDb().collection('recipes').find(query).toArray();
    if (!recipes || recipes.length == 0)
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(404).send('No recipes found for given category.');
    }
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(recipes);
};
