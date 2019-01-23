process.env.NODE_ENV = 'test';

// Test module imports.
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

// Server import and creation
const server = require('../server');

const ObjectID = require('mongodb').ObjectID;

// DB import.
const db = require('../db');

// Token for testing.
let token = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RVc2VyIiwiaWF0IjoxNTM5MDUwMzQwfQ.lu84aP6OBUpgPdLdmj8BRJMoBH19BHcBBT_VQ6Jm9TI"

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
	    .set({ 'Authorization': token })
	    .end((err, res) => {
		res.should.have.status(422);
		res.body['msg']['noNameError'].should.be.equal('Please include a name in your recipe.');
		done();
	    });
    });

    it('Should fail if there are no ingredients listed', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .set({ 'Authorization': token })
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
	    .set({ 'Authorization': token })
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
	    .set({ 'Authorization': token })
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
	    .set({ 'Authorization': token })
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
	    .set({ 'Authorization': token })
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
	    .set({ 'Authorization': token })
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
	    .set({ 'Authorization': token })
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
		courses: [
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
	    .set({ 'Authorization': token })
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
		courses: [
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
	    .set({ 'Authorization': token })
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
		courses: [
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
		res.body['msg']['noCuisinesError'].should.be.equal('Please include one or more cuisines this dish is a part of.');
		done();
	    });
    });

    it('Should fail because there is no searchable', (done) => {
	chai.request(server)
	    .post('/recipes/add')
	    .set({ 'Authorization': token })
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
		courses: [
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
		cuisines: [
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
	    .set({ 'Authorization': token })
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
		courses: [
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
		cuisines: [
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
	    .set({ 'Authorization': token })
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
		courses: [
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
		cuisines: [
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
	    .set({ 'Authorization': token })
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
		courses: [
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
		cuisines: [
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
	    .set({ 'Authorization': token })
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
		courses: [
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
		cuisines: [
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
