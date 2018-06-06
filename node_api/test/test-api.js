process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

const server = require('../server');
const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const dbUrl = 'mongodb://' + config.get('dbConfig.host');
const dbPort = config.get('dbConfig.port');
const dbName = config.get('dbConfig.name');
var db;

// TODO(map) : Ask on stack overflow or maybe ask Andrew how I should properly moch a test DB connection here becuase
// I'm currently having to create a self contained MongoClient and create a server instance to be able to run the
// test and this is really really bad.

MongoClient.connect(dbUrl + ":" + dbPort + "/" + dbName, {poolSize: 10}, function(err, database) {
    if(err) throw err;
    db = database; // Set the db variable for reuse.
});

describe('Recipes with empty database', () => {
    beforeEach((done) => {
	db.dropCollection('recipes', (err, results) => {
	    if (err)
	    {
		throw err;
	    }
	    if (results)
	    {
		console.log('Dropped the recipes collection.');
	    }
	});
	db.createCollection('recipes', (err, results) => {
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
	db.collection('recipes').insertOne(recipe1, (err, result) => {
	    done();
	});
    });

    describe('/recipes/:recipeName?', () => {
	it('Should return the mac and cheese recipe.', (done) => {
	    chai.request(server)
		.get('/recipes/mikes_mac_and_cheese')
		.end((err, res) => {
		    res.should.have.status(200);
		    res.body['recipes'].length.should.be.eql(1);
		    res.body['recipes'][0]['search_name'].should.be.eql('mikes_mac_and_cheese');
		    done();
		});
	});
    });
    
});
