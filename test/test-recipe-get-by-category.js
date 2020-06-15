process.env.NODE_ENV = 'test';

// Test fixture imports.
const testFixtures = require('./test-fixtures');

// Test module imports.
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

// Server import and creation
const server = require('../server');

// DB import.
const db = require('../db');

describe('All recipe endpoints with an empty database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();
	
	await db.getDb().createCollection('recipes');
    });
    
    /*
    it('Should return 404 because there were not categories passed in',(done) => {
        try {
	chai.request(server)
	    .get('/getRecipesByCategory')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('Please include one or more categories to filter by.');
		done();
	    });
        } catch(ex) {
            console.log(ex);
        };
    });
    */
    
    it('Should return 404 because there were no recipes found',(done) => {
	chai.request(server)
	    .get('/getRecipesByCategory?list=pasta')
	    .end((err, res) => {
		res.should.have.status(404);
		res.body['msg'].should.be.equal('No recipes found for given category.');
		done();
	    });
    });

});
