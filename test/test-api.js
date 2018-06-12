process.env.NODE_ENV = 'test';

// Test module imports.
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

// Server import and creation
const server = require('../server');

// DB import.
const db = require('../db');
db.connect();


describe('Recipes with empty database', () => {
    beforeEach((done) => {
	
	db.getDb().dropCollection('recipes', (err, results) => {
	    if (err)
	    {
		throw err;
	    }
	    if (results)
	    {
		console.log('Dropped the recipes collection.');
	    }
	});
	db.getDb().createCollection('recipes', (err, results) => {
	    if (err)
	    {
		throw err;
	    }
	    if (results)
	    {
		console.log('Recreated the recipes collection.');
	    }
	    done();
	});
    });
    
    describe('/recipes', () => {
	it('Should return no recipes because there are none in the database', (done) => {
	    chai.request(server)
		.get('/recipes')
		.end((err, res) => {
		    res.body['recipes'].length.should.be.eql(0);
		    done();
		});
	});
    });

    describe('/recipes/add', () => {
	it('Should add a recipe to the database', (done) => {
	    var recipe = {"C": "D"};
	    chai.request(server)
		.post('/recipes/add')
		.send(recipe)
		.end((err, res) => {
		    res.should.have.status(200);
		    done();
		});
	});
    });

});

describe('Recipes with populated database', () => {
    before((done) => {
	var recipe1 = {"search_name": "mikes_mac_and_cheese", "text_friendly_name": "Mikes Mac and Cheese","ingredients": [{"name": "elbow_noodles","text_friendly_name": "elbow noodles","quantity": 12,"measurement": "oz"},{"name": "cheddar_cheese","text_friendly_name": "cheddar cheese","quantity": 6,"measurement": "oz"},{"name": "gouda_cheese","text_friendly_name": "gouda cheese","quantity": 6,"measurement": "oz"},{"name": "milk","text_friendly_name": "milk","quantity": 2,"measurement": "oz"}],"steps": ["Bring water to a boil","Cook noodels until al dente.","Add the milk and cheeses and melt down.","Stir constantly to ensure even coating and serve."],"course": ["dinner","lunch","side"],"prep_time": {"minutes": 15,"hours": 0},"cook_time":{"minutes": 25,"hours": 1},"cuisine": "italian","submitted_by": "User1","searchable": true};
	
	db.getDb().dropCollection('recipes', (err, results) => {
	    if (err)
	    {
		throw err;
	    }
	    if (results)
	    {
		console.log('Dropped the recipes collection.');
	    }
	});

	db.getDb().createCollection('recipes', (err, results) => {
	    if (err)
	    {
		throw err;
	    }
	    if (results)
	    {
		console.log('Recreated the recipes collection.');
	    }
	});

	db.getDb().collection('recipes').insertOne(recipe1, (err, result) => {
	    done();
	});
    });

    describe('/recipes/name/:recipeName?', () => {
	it('Should return the mac and cheese recipe.', (done) => {
	    chai.request(server)
		.get('/recipes/name/mikes_mac_and_cheese')
		.end((err, res) => {
		    res.should.have.status(200);
		    res.body['recipes'].length.should.be.eql(1);
		    res.body['recipes'][0]['search_name'].should.be.eql('mikes_mac_and_cheese');
		    done();
		});
	});

	it('Should return a 400 error because the recipe doesn\'t exist', (done) => {
	    chai.request(server)
		.get('/recipes/name/i_dont_exist')
		.end((err, res) => {
		    res.should.have.status(400);
		    res.body['message'].should.be.eql('No recipes found by that name.');
		    done();
		    process.exit();
		});
	});

    });
    
});
