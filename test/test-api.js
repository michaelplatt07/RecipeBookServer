process.env.NODE_ENV = 'test';

// Test module imports.
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

// Server import and creation
const server = require('../server');

const ObjectID = require('mongodb').ObjectID;

// DB import.
const db = require('../db');
db.connect();

describe('All recipe endpoints with an empty database', () => {
    beforeEach((done) => {
	db.collectionExists('recipes').then((exists) => {
	    if (exists) {
		db.getDb().dropCollection('recipes', (err, results) => {
		    if (err)
		    {
			throw err;
		    }
		});
	    }
	    
	    db.getDb().createCollection('recipes', (err, results) => {
		if (err)
		{
		    throw err;
		}
		done();
	    });
	});
    });
    
    it('Should return no recipes because there are none in the database', (done) => {
	chai.request(server)
	    .get('/recipes')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There are currently no recipes in the database.');
		done();
	    });
    });
    
    it('Should return no recipes found for the given ID', (done) => {
	chai.request(server)
	    .get('/recipes/id/5b69bea0d125e430b8d6eca2')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There were no recipes found for the given ID.');
		done();
	    });
    });    

    it('Should return no recipes found for the given criteria', (done) => {
	chai.request(server)
	    .get('/recipes/search')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There were no recipes found that contained all the given criteria.');
		done();
	    });
    });    

    it('Should return no recipes found for the given ingredients',(done) => {
	chai.request(server)
	    .get('/recipes/ingredients')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('Please include one or more ingredients to filter by.');
		done();
	    });
    });

    it('Should return no recipes found for the given course',(done) => {
	chai.request(server)
	    .get('/recipes/course')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('Please include one or more courses to filter by.');
		done();
	    });
    });

    it('Should return no recipes found for the given cuisine',(done) => {
	chai.request(server)
	    .get('/recipes/cuisine')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('Please include one or more cuisines to filter by.');
		done();
	    });
    });

    it('Should return no recipes found in the database',(done) => {
	chai.request(server)
	    .get('/recipes/random')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There are currently no recipes in the database.');
		done();
	    });
    });

    it('Should return no recipes found for the given name',(done) => {
	chai.request(server)
	    .get('/recipes/name/some_name')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There are no recipes found by that name.');
		done();
	    });
    });
    
});

describe('All recipe endpoints with sample recipes in the database', () => {
    before((done) => {
	var recipe1 = {_id: ObjectID("5b69bea0d125e430b8d6eca2"), "search_name": "mikes_mac_and_cheese", "text_friendly_name": "Mikes Mac and Cheese","ingredients": [{"name": "elbow_noodles","text_friendly_name": "elbow noodles","quantity": 12,"measurement": "oz"},{"name": "cheddar_cheese","text_friendly_name": "cheddar cheese","quantity": 6,"measurement": "oz"},{"name": "gouda_cheese","text_friendly_name": "gouda cheese","quantity": 6,"measurement": "oz"},{"name": "milk","text_friendly_name": "milk","quantity": 2,"measurement": "oz"}],"steps": ["Bring water to a boil","Cook noodels until al dente.","Add the milk and cheeses and melt down.","Stir constantly to ensure even coating and serve."],"course": ["dinner","lunch","side"],"prep_time": {"minutes": 15,"hours": 0},"cook_time":{"minutes": 25,"hours": 1},"cuisine": "italian","submitted_by": "User1","searchable": true};
	var recipe2 = {_id: ObjectID("5b69bea0d125e430b8d6eca3"), "search_name": "ice_cream", "text_friendly_name": "Ice Cream", "ingredients": [{"name": "sugar", "text_friendly_name": "sugar", "quantity": 8, "measurment": "Tbsp"}, {"name": "vanilla", "text_friendly_name": "vanilla", "quantity": 2, "measurment": "tsp"}, {"name": "milk", "text_friendly_name": "milk", "quantity": 12, "measurment": "oz"}], "steps": ["Mix everything together.", "Tumble until solid."], "course": ["dessert"], "prep_time": {"minutes": 5, "hours": 0}, "cook_time": {"minutes": 40, "hours": 2}, "cuisine": "american", "submitted_by": "User1", "searchable": true};

	var recipes = [recipe1, recipe2];
	
	db.collectionExists('recipes').then((exists) => {
	    if (exists) {
		db.getDb().dropCollection('recipes', (err, results) => {
		    if (err)
		    {
			throw err;
		    }
		});
	    }
	    
	    db.getDb().collection('recipes').insertMany(recipes, (err, result) => {
		done();
	    });

	});
    });

    it('Should return the number of recipes in the database, in this case 2', (done) => {
	chai.request(server)
	    .get('/recipes')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return a single recipe given the correct ID', (done) => {
	chai.request(server)
	    .get('/recipes/id/5b69bea0d125e430b8d6eca2')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipe']['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the mac and cheese recipe as we are only searching by the cheese ingredient', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=gouda_cheese')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe as we are only searching by the vanilla ingredient', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=vanilla')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });    

    it('Should return both the mac and cheese recipe and ice cream recipe since we are using an ingredient from each', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=gouda_cheese+vanilla')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return the mac and cheese recipe because we searched by its course', (done) => {
	chai.request(server)
	    .get('/recipes/search?course=dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe because we searched by its course', (done) => {
	chai.request(server)
	    .get('/recipes/search?course=dessert')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return both recipes because we searched by multiple', (done) => {
	chai.request(server)
	    .get('/recipes/search?course=dessert+side')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return both recipes because we searched by their author', (done) => {
	chai.request(server)
	    .get('/recipes/search?submitted_by=User1')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });
    
    it('Should return the mac and cheese recipe because we searched by its cuisine', (done) => {
	chai.request(server)
	    .get('/recipes/search?cuisine=italian')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe because we searched by its cuisine', (done) => {
	chai.request(server)
	    .get('/recipes/search?cuisine=american')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return both recipes because we searched by multipl cuisines', (done) => {
	chai.request(server)
	    .get('/recipes/search?cuisine=american+italian')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return no recipes because we searched by parameters that don\'t all fall into a single recipe', (done) => {
	chai.request(server)
	    .get('/recipes/search?cuisine=american&course=dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return mac and cheese because all parameters fall into that recipe.', (done) => {
	chai.request(server)
	    .get('/recipes/search?cuisine=italian&course=dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the mac and cheese recipe based on the one ingredient we search on.',(done) => {
	chai.request(server)
	    .get('/recipes/ingredients?list=gouda_cheese')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return both recipes based on the two ingredients we search on.',(done) => {
	chai.request(server)
	    .get('/recipes/ingredients?list=milk')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return the ice cream recipe based on the one ingredient we search on.',(done) => {
	chai.request(server)
	    .get('/recipes/ingredients?list=vanilla')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return the mac and cheese recipe based on the course given',(done) => {
	chai.request(server)
	    .get('/recipes/course?list=dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe based on the course given',(done) => {
	chai.request(server)
	    .get('/recipes/course?list=dessert')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return no recipes based on the course given',(done) => {
	chai.request(server)
	    .get('/recipes/course?list=breakfast')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There were no recipes found for that course.');
		done();
	    });
    });

    it('Should return no recipes based on the course given',(done) => {
	chai.request(server)
	    .get('/recipes/course?list=dinner+dessert')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return the mac and cheese recipe based on the cuisine we are searching by.',(done) => {
	chai.request(server)
	    .get('/recipes/cuisine?list=italian')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe based on the cuisine we are searching by.',(done) => {
	chai.request(server)
	    .get('/recipes/cuisine?list=american')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return both recipes based on the cuisines we are searching by.',(done) => {
	chai.request(server)
	    .get('/recipes/cuisine?list=american+italian')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return a random recipe',(done) => {
	chai.request(server)
	    .get('/recipes/random')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipe']['search_name'].should.not.be.empty;
		done();
	    });
    });

    it('Should return no recipes found for the given name',(done) => {
	chai.request(server)
	    .get('/recipes/name/i_dont-exist')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.not.be.equal('Ther are no recipes found by that name.');
		done();
	    });
    });

    it('Should return the mac and cheese recipe because that\`s the name we searched by',(done) => {
	chai.request(server)
	    .get('/recipes/name/mikes_mac_and_cheese')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe because that\`s the name we searched by',(done) => {
	chai.request(server)
	    .get('/recipes/name/ice_cream')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });
    
});

describe('Various tests for PUTting recipe data in the databse', () => {
    before((done) => {
	db.collectionExists('recipes').then((exists) => {
	    if (exists) {
		db.getDb().dropCollection('recipes', (err, results) => {
		    if (err)
		    {
			throw err;
		    }
		    db.collectionExists('ingredients').then((exists) => {
			if (exists)
			{
			    db.getDb().dropCollection('ingredients', (err, results) => {
				if (err)
				{
				    throw err;
				}
			    });			    
			}
		    });
		});
	    }
	    
	    db.getDb().createCollection('recipes', (err, results) => {
		if (err)
		{
		    throw err;
		}
		db.getDb().createCollection('ingredients', (err, results) => {
		    if (err)
		    {
			throw err;
		    }
		    done();
		});	
	    });
	});
    });
    
    it('Should fail if there is no name sent to the server', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({})
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noNameError'].should.be.equal('Please include a name in your recipe.');
		done();
	    });
    });

    it('Should fail if there are no ingredients listed', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({text_friendly_name: 'Sample Recipe'})
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noIngredientsError'].should.be.equal('Please include a list of ingredients in your recipe.');
		done();
	    });
    });

    it('Should fail if the ingredients don\'t have a name', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			quantity: 8,
			measurement: 'Tbsp'
		    }
		]
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noIngredientNameError'].should.be.equal('One ore more of the ingredients did not have a name given.');
		done();
	    });
    });

    it('Should fail if the ingredients don\'t have a quantity', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			measurement: 'Tbsp'
		    }
		]
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noIngredientQuantityError'].should.be.equal('One or more of the ingredients did not have a quantity given.');
		done();
	    });
    });

    it('Should fail if the ingredients don\'t have a measurement', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8
		    }
		]
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noIngredientMeasurementError'].should.be.equal('One or more of the ingredients did not have a measurement given.');
		done();
	    });
    });

    it('Should fail if the there are no steps', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8,
			measurement: 'Tbsp'
		    }
		]
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noStepsError'].should.be.equal('Please include steps in your recipe.');
		done();
	    });
    });
    
    it('Should fail if the there are no courses listed', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8,
			measurement: 'Tbsp'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		]
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noCoursesError'].should.be.equal('Please include at least one course this recipe belongs to.');
		done();
	    });
    });

    it('Should fail if the there is no prep time', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8,
			measurement: 'Tbsp'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		],
		course: [
		    "brinner"
		]
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noPrepTimeError'].should.be.equal('Please include a prep time.');
		done();
	    });
    });

    it('Should fail if the there is no cook time', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8,
			measurement: 'Tbsp'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		],
		course: [
		    "brinner"
		],
		prep_time: {
		    "minutes": 5,
		    "hours": 0
		}
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noCookTimeError'].should.be.equal('Please include a cook time.');
		done();
	    });
    });

    it('Should fail if the there is no cuisine', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8,
			measurement: 'Tbsp'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		],
		course: [
		    "brinner"
		],
		prep_time: {
		    "minutes": 5,
		    "hours": 0
		},
		cook_time: {
		    "minutes": 10,
		    "hours": 1
		}
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noCuisineError'].should.be.equal('Please include one or more cuisines this dish is a part of.');
		done();
	    });
    });

    it('Should fail because there is no searchable', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8,
			measurement: 'Tbsp'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		],
		course: [
		    "brinner"
		],
		prep_time: {
		    "minutes": 5,
		    "hours": 0
		},
		cook_time: {
		    "minutes": 10,
		    "hours": 1
		},
		cuisine: [
		    'american'
		]
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noSearchableError'].should.be.equal('Please select if you want the recipe to be private or public.');
		done();
	    });
    });

    it('Should should fail because there is no description', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8,
			measurement: 'Tbsp'
		    },
		    {
			text_friendly_name: 'Ingredient 2',
			quantity: 1,
			measurement: 'oz'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		],
		course: [
		    "brinner"
		],
		prep_time: {
		    "minutes": 5,
		    "hours": 0
		},
		cook_time: {
		    "minutes": 10,
		    "hours": 1
		},
		cuisine: [
		    'american'
		],
		searchable: true
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noDescriptionError'].should.be.equal('Please include a description of the dish.');		done();
	    });
    });
    
    it('Should successfully insert Recipe 1 because all data is there', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 1',
			quantity: 8,
			measurement: 'Tbsp'
		    },
		    {
			text_friendly_name: 'Ingredient 2',
			quantity: 1,
			measurement: 'oz'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		],
		course: [
		    "brinner"
		],
		prep_time: {
		    "minutes": 5,
		    "hours": 0
		},
		cook_time: {
		    "minutes": 10,
		    "hours": 1
		},
		cuisine: [
		    'american'
		],
		searchable: true,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ornare urna imperdiet nisl semper maximus. Duis egestas elit a mi ornare, at fringilla lorem mattis. Duis feugiat velit nisi, in placerat dolor facilisis sit amet. In pulvinar et felis eget sagittis. Phasellus ac ipsum et orci interdum ultricies. Suspendisse mauris nibh, euismod in neque et, elementum sagittis eros. Sed mi justo, luctus sed tortor quis, vulputate hendrerit felis. Nunc tincidunt ultricies luctus. Donec imperdiet id nunc nec tempus. Suspendisse sit amet nunc pellentesque, facilisis mauris quis, gravida est. Suspendisse dapibus risus ut aliquam rutrum. Pellentesque erat arcu, pretium eu nisi ut, vestibulum euismod nunc. Mauris ac pulvinar ipsum, quis rutrum quam. Nam non tincidunt nisi. Nam nec arcu ut risus dapibus convallis. Vestibulum nisl elit, congue eu purus eu, luctus mollis risus."
	    })
	    .end((err, res) => {
		res.should.have.status(200);
		done();
	    });
    });

    it('Should successfully insert Recipe 2 because all data is there', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe 2',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 2',
			quantity: 3,
			measurement: 'c'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		],
		course: [
		    "brinner"
		],
		prep_time: {
		    "minutes": 5,
		    "hours": 0
		},
		cook_time: {
		    "minutes": 10,
		    "hours": 1
		},
		cuisine: [
		    'american'
		],
		searchable: true,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ornare urna imperdiet nisl semper maximus. Duis egestas elit a mi ornare, at fringilla lorem mattis. Duis feugiat velit nisi, in placerat dolor facilisis sit amet. In pulvinar et felis eget sagittis. Phasellus ac ipsum et orci interdum ultricies. Suspendisse mauris nibh, euismod in neque et, elementum sagittis eros. Sed mi justo, luctus sed tortor quis, vulputate hendrerit felis. Nunc tincidunt ultricies luctus. Donec imperdiet id nunc nec tempus. Suspendisse sit amet nunc pellentesque, facilisis mauris quis, gravida est. Suspendisse dapibus risus ut aliquam rutrum. Pellentesque erat arcu, pretium eu nisi ut, vestibulum euismod nunc. Mauris ac pulvinar ipsum, quis rutrum quam. Nam non tincidunt nisi. Nam nec arcu ut risus dapibus convallis. Vestibulum nisl elit, congue eu purus eu, luctus mollis risus."
	    })
	    .end((err, res) => {
		res.should.have.status(200);
		done();
	    });
    });
    
    it('Should successfully insert Recipe 3 because all data is there', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .send({
		text_friendly_name: 'Sample Recipe 3',
		ingredients: [
		    {
			text_friendly_name: 'Ingredient 2',
			quantity: 1.5,
			measurement: 'c'
		    }
		],
		steps: [
		    "Cut stuff up.",
		    "Mix stuff together.",
		    "Cook it and enjoy"
		],
		course: [
		    "brinner"
		],
		prep_time: {
		    "minutes": 5,
		    "hours": 0
		},
		cook_time: {
		    "minutes": 10,
		    "hours": 1
		},
		cuisine: [
		    'american'
		],
		searchable: true,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ornare urna imperdiet nisl semper maximus. Duis egestas elit a mi ornare, at fringilla lorem mattis. Duis feugiat velit nisi, in placerat dolor facilisis sit amet. In pulvinar et felis eget sagittis. Phasellus ac ipsum et orci interdum ultricies. Suspendisse mauris nibh, euismod in neque et, elementum sagittis eros. Sed mi justo, luctus sed tortor quis, vulputate hendrerit felis. Nunc tincidunt ultricies luctus. Donec imperdiet id nunc nec tempus. Suspendisse sit amet nunc pellentesque, facilisis mauris quis, gravida est. Suspendisse dapibus risus ut aliquam rutrum. Pellentesque erat arcu, pretium eu nisi ut, vestibulum euismod nunc. Mauris ac pulvinar ipsum, quis rutrum quam. Nam non tincidunt nisi. Nam nec arcu ut risus dapibus convallis. Vestibulum nisl elit, congue eu purus eu, luctus mollis risus."
	    })
	    .end((err, res) => {
		res.should.have.status(200);
		done();
	    });
    });

    it('Should be return the recipe found by name.', (done) => {
	chai.request(server)
	    .get('/recipes/name/sample_recipe')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.equal(1);
		done();
	    });
    });

    it('Should return Tbsp because that is the only measurement given for ingredient 1.', (done) => {
	db.getDb().collection('ingredients').find({name: "ingredient_1"}).toArray((err, results) => {
	    results.length.should.be.equal(1);
	    results[0]['most_used_measurement'].should.be.equal('Tbsp');
	    results[0]['measurement_ratios'][0]["measurement"].should.be.equal('Tbsp');
	    results[0]['measurement_ratios'][0]["percentage"].should.be.equal(1);
	    done();
	});
    });    

    it('Should ensure that ingredient 2 has the appropriate information set for measurments.', (done) => {
	db.getDb().collection('ingredients').find({name: "ingredient_2"}).toArray((err, results) => {
	    results.length.should.be.equal(1);
	    results[0]['total_measurements_added'].should.be.equal(3);
	    results[0]['measurement_ratios'][0]["measurement"].should.be.equal('oz');
	    results[0]['measurement_ratios'][0]["percentage"].should.be.equal(33);
	    results[0]['measurement_ratios'][0]["count"].should.be.equal(1);
	    results[0]['measurement_ratios'][1]["measurement"].should.be.equal('c');
	    results[0]['measurement_ratios'][1]["percentage"].should.be.equal(66);
	    results[0]['measurement_ratios'][1]["count"].should.be.equal(2);
	    results[0]['most_used_measurement'].should.be.equal('c');
	    done();
	});
    });    

});

describe('Testing the grocery list GET API', () => {
    var recipe1 = {_id: ObjectID("5b69bea0d125e430b8d6eca2"), "text_friendly_name": 'Sample Recipe', "ingredients": [{"text_friendly_name": 'Ingredient 1', "quantity": 8, "measurement": 'Tbsp'}, {"text_friendly_name": 'Ingredient 2',	"quantity": 1, "measurement": 'tsp'}],"steps": ["Cut stuff up.", "Mix stuff together.", "Cook it and enjoy"], "course": [ "brinner" ], "prep_time": { "minutes": 5, "hours": 0 }, "cook_time": { "minutes": 10, "hours": 1 }, "cuisine": [ 'american' ], "searchable": true };
    var recipe2 = {_id: ObjectID("5b69bea0d125e430b8d6eca3"), "text_friendly_name": 'Sample Recipe 2', "ingredients": [{ "text_friendly_name": 'Ingredient 2', "quantity": 3, "measurement": 'c'}], "steps": [ "Cut stuff up.", "Mix stuff together.", "Cook it and enjoy" ], "course": [ "brinner" ],"prep_time": {"minutes": 5,"hours": 0},"cook_time": {"minutes": 10,"hours": 1},cuisine: ['american'],"searchable": true};
    var recipe3 = {_id: ObjectID("5b69bea0d125e430b8d6eca1"), "text_friendly_name": 'Sample Recipe 3',"ingredients": [{"text_friendly_name": 'Ingredient 2',"quantity": 1.5,"measurement": 'Tbsp'}],"steps": [ "Cut stuff up.", "Mix stuff together.", "Cook it and enjoy"],"course": ["brinner"],"prep_time": { "minutes": 5, "hours": 0},"cook_time": { "minutes": 10, "hours": 1},"cuisine": ['american'],"searchable": true};
    let recipes = [recipe1, recipe2, recipe3];
    let grocery_list = { "user": "test.user", "recipes":["5b69bea0d125e430b8d6eca2","5b69bea0d125e430b8d6eca1","5b69bea0d125e430b8d6eca3"]}
    
    before((done) => {
	db.collectionExistsAndDrop(db, 'recipes').then((dropped) => {
	    db.collectionExistsAndDrop(db, 'grocery_lists').then((dropped) => {
		db.getDb().collection('recipes').insertMany(recipes, (err, result) => {
		    db.getDb().collection('grocery_lists').insertOne(grocery_list, (err, result) => {
			done()
		    })
		});
	    });
	});
    });

    it('Should fail to return a grocery list because there is no userId', (done) => {
	chai.request(server)
	    .get('/groceryList')
	    .set('userId', '')
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['msg'].should.be.equal('There was no userId supplied.');
		done()
	    });
    });

    it('Should return the recipes list with the correct IDs as well as the full grocery list', (done) => {
	chai.request(server)
	    .get('/groceryList')
	    .set('userId', 'test.user')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipeList'].length.should.be.equal(3);
		res.body['groceryShoppingList']['ingredient_2'].should.be.equal(3.1145833333333335);
		done();
	    });
    });
    
});


describe('Testing the grocery list PUT API', () => {
    before((done) => {
	db.collectionExists('grocery_lists').then((exists) => {
	    if (exists) {
		db.getDb().dropCollection('grocery_lists', (err, results) => {
		    if (err)
		    {
			throw err;
		    }
		    done();
		});
	    }
	    else
	    {
		done();
	    }
	    
	});	
    });

    it('Should insert blank grocery list', (done) => {
	chai.request(server)
	    .post('/groceryList/add')
	    .send({
		")user": "test.user",
		"recipes": [
		]
	    })
	    .end((err, res) => {
		res.should.have.status(200);
		done();
	    });
    });

    it('Should return an error stating there is no recipeId', (done) => {
	chai.request(server)
	    .post('/groceryList/addRecipe')
	    .send({
		"user": "test.user"
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg'].should.be.equal("There was no recipeId supplied.");
		done();
	    });
    });

    it('Should return an error stating there is no userId', (done) => {
	chai.request(server)
	    .post('/groceryList/addRecipe')
	    .send({
		"recipeId": "5b2abac30cd38878b65a3c21"
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg'].should.be.equal("There was no userId supplied.");
		done();
	    });
    });
    
    it('Should add a recipe to grocery list', (done) => {
	chai.request(server)
	    .post('/groceryList/addRecipe')
	    .send({
		"recipeId": "5b2abac30cd38878b65a3c21",
		"user": "test.user"
	    })
	    .end((err, res) => {
		res.should.have.status(200);
		done();
	    });
    });
    
    it('Should fail to remove the recipe because there is no recipeId supplied', (done) => {
	chai.request(server)
	    .post('/groceryList/removeRecipe')
	    .send({
		"user": "test.user"
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg'].should.be.equal('There was no recipeId supplied.');
		done();
	    });
    });

    it('Should fail to remove the recipe because there is no userId supplied', (done) => {
	chai.request(server)
	    .post('/groceryList/removeRecipe')
	    .send({
		"recipeId": "5b2abac30cd38878b65a3c21"
	    })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg'].should.be.equal("There was no userId supplied.");
		done();
	    });
    });

    it('Should successfully remove the recipe', (done) => {
	chai.request(server)
	    .post('/groceryList/removeRecipe')
	    .send({
		"recipeId": "5b2abac30cd38878b65a3c21",
		"user": "test.user"
	    })
	    .end((err, res) => {
		res.should.have.status(200);
		done();
	    });
    });

});
