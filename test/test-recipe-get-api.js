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

describe('All recipe endpoints with an empty database', () => {
    beforeEach(async () => {
	let exists = await db.collectionExists('recipes')
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
	});
	
    });

    it('Should return no recipes because there are none in the database', (done) => {
	chai.request(server)
	    .get('/recipes')
	    .set({ 'Authorization': token})
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There are currently no recipes in the database.');
		done();
	    });
    });
    
    it('Should return no recipes found for the given ID', (done) => {
	chai.request(server)
	    .get('/recipes/id/5b69bea0d125e430b8d6eca2')
	    .set({ 'Authorization': token})
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

    it('Should return no recipes found for the given filter options', (done) => {
	chai.request(server)
	    .get('/recipes/filter')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There were no recipes found given the filter options.');
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

    it('Should return no recipes found for the given courses',(done) => {
	chai.request(server)
	    .get('/recipes/courses')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('Please include one or more courses to filter by.');
		done();
	    });
    });

    it('Should return no recipes found for the given cuisines',(done) => {
	chai.request(server)
	    .get('/recipes/cuisines')
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
	var recipe1 = {_id: ObjectID("5b69bea0d125e430b8d6eca2"), "search_name": "mikes_mac_and_cheese", "text_friendly_name": "Mikes Mac and Cheese","ingredients": [{"name": "elbow_noodles","text_friendly_name": "elbow noodles","quantity": 12,"measurement": "oz"},{"name": "cheddar_cheese","text_friendly_name": "cheddar cheese","quantity": 6,"measurement": "oz"},{"name": "gouda_cheese","text_friendly_name": "gouda cheese","quantity": 6,"measurement": "oz"},{"name": "milk","text_friendly_name": "milk","quantity": 2,"measurement": "oz"}],"steps": ["Bring water to a boil","Cook noodels until al dente.","Add the milk and cheeses and melt down.","Stir constantly to ensure even coating and serve."],"courses": ["dinner","lunch","side"],"prep_time": {"minutes": 15,"hours": 0},"cook_time":{"minutes": 25,"hours": 1},"cuisines": "italian","submitted_by": "User1","searchable": true};
	var recipe2 = {_id: ObjectID("5b69bea0d125e430b8d6eca3"), "search_name": "ice_cream", "text_friendly_name": "Ice Cream", "ingredients": [{"name": "sugar", "text_friendly_name": "sugar", "quantity": 8, "measurment": "Tbsp"}, {"name": "vanilla", "text_friendly_name": "vanilla", "quantity": 2, "measurment": "tsp"}, {"name": "milk", "text_friendly_name": "milk", "quantity": 12, "measurment": "oz"}], "steps": ["Mix everything together.", "Tumble until solid."], "courses": ["dessert"], "prep_time": {"minutes": 5, "hours": 0}, "cook_time": {"minutes": 40, "hours": 2}, "cuisines": "american", "submitted_by": "User1", "searchable": true};

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
	    .get('/recipes/search?ingredients=vanilla&courses=vanilla&submitted_by=vanilla&cuisines=vanilla')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });    

    it('Should return both the mac and cheese recipe and ice cream recipe since we are using an ingredient from each', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=gouda_cheese vanilla&courses=gouda_cheese vanilla&submitted_by=gouda_cheese vanilla&cuisines=gouda_cheese vanilla')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return the mac and cheese recipe because we searched by its courses', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=dinner&courses=dinner&submitted_by=dinner&cuisines=dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe because we searched by its courses', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=dessert&courses=dessert&submitted_by=dessert&cuisines=dessert')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return both recipes because we searched by multiple', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=dessert+side&courses=dessert+side&submitted_by=dessert+side&cuisines=dessert+side')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return both recipes because we searched by their author', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=User1&courses=User1&submitted_by=User1&cuisines=User1')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });
    
    it('Should return the mac and cheese recipe because we searched by its cuisines', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=italian&courses=italian&submitted_by=italian&cuisines=italian')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe because we searched by its cuisines', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=american&courses=american&submitted_by=american&cuisines=american')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return both recipes because we searched by multiple cuisines', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=american+italian&courses=american+italian&submitted_by=american+italian&cuisines=american+italian')
            .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return no recipes because we searched by parameters that don\'t all fall into a single recipe', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=american+dinner&courses=american+dinner&submitted_by=american+dinner&cuisines=american+dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return mac and cheese because all parameters fall into that recipe.', (done) => {
	chai.request(server)
	    .get('/recipes/search?ingredients=italian+dinner&courses=italian+dinner&submitted_by=italian+dinner&cuisines=italian+dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the mac and cheese because we filtered on just that courses.', (done) => {
	chai.request(server)
	    .get('/recipes/filter?courses=dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    })

    it('Should return the mac and cheese because we filtered on its course and cuisine.', (done) => {
	chai.request(server)
	    .get('/recipes/filter?courses=dinner&cuisines=italian')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    })

    it('Should return two recipes because we filtered on their course and cuisines.', (done) => {
	chai.request(server)
	    .get('/recipes/filter?courses=dinner&cuisines=italian+american')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    })

    it('Should return two recipes because we filtered on their course and cuisine.', (done) => {
	chai.request(server)
	    .get('/recipes/filter?courses=dinner+dessert&cuisines=italian')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    })

    it('Should return the mac and cheese because we filtered on its course and cuisine and ingredient.', (done) => {
	chai.request(server)
	    .get('/recipes/filter?courses=dinner&cuisines=italian&ingredients=gouda_cheese')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    })

    it('Should return two recipes because we filtered on their course and cuisine and ingredient.', (done) => {
	chai.request(server)
	    .get('/recipes/filter?courses=dinner&cuisines=italian&ingredients=gouda_cheese+milk')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    })

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

    it('Should return the mac and cheese recipe based on the courses given',(done) => {
	chai.request(server)
	    .get('/recipes/courses?list=dinner')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe based on the courses given',(done) => {
	chai.request(server)
	    .get('/recipes/courses?list=dessert')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return no recipes based on the courses given',(done) => {
	chai.request(server)
	    .get('/recipes/courses?list=breakfast')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('There were no recipes found for that courses.');
		done();
	    });
    });

    it('Should return no recipes based on the courses given',(done) => {
	chai.request(server)
	    .get('/recipes/courses?list=dinner+dessert')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'].length.should.be.equal(2);
		done();
	    });
    });

    it('Should return the mac and cheese recipe based on the cuisines we are searching by.',(done) => {
	chai.request(server)
	    .get('/recipes/cuisines?list=italian')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('mikes_mac_and_cheese');
		done();
	    });
    });

    it('Should return the ice cream recipe based on the cuisines we are searching by.',(done) => {
	chai.request(server)
	    .get('/recipes/cuisines?list=american')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['recipes'][0]['search_name'].should.be.equal('ice_cream');
		done();
	    });
    });

    it('Should return both recipes based on the cuisines we are searching by.',(done) => {
	chai.request(server)
	    .get('/recipes/cuisines?list=american+italian')
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
