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


describe('All category endpoints with no data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('categories');
    });

    it('Should return 404 because there are no categories.', (done) => {
        chai.request(server)
            .get('/categories')
            .end((err, res) => {
                res.should.have.status(404);
                res.body['msg'].should.be.equal('There are currently no categories in the database.');
                done();
            });
    });
    
});

describe('All category endpoints with data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();
        
        await db.getDb().createCollection('categories');        
	await db.getDb().collection('categories').insertMany(testFixtures.sampleCategories);
    });

    it('Should return two categories because we hit the return all endpoint.', (done) => {
        chai.request(server)
            .get('/categories')
            .end((err, res) => {
                res.should.have.status(200);
                res.body['categories'].length.should.be.equal(2);
                done();
            });
    });
    
});
