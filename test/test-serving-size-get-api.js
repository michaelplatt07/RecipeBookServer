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


describe('All servingSize endpoints with no data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('serving_sizes');
    });

    it('Should return 404 because there are no serving sizes.', (done) => {
        chai.request(server)
            .get('/servingSizes')
            .end((err, res) => {
                res.should.have.status(404);
                res.body['msg'].should.be.equal('There are currently no servingSizes in the database.');
                done();
            });
    });
    
});

describe('All servingSzies endpoints with data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();
        
        await db.getDb().createCollection('serving_sizes');        
	await db.getDb().collection('serving_sizes').insertMany(testFixtures.sampleServingSizes);
    });

    it('Should return two servingSizes because we hit the return all endpoint.', (done) => {
        chai.request(server)
            .get('/servingSizes')
            .end((err, res) => {
                res.should.have.status(200);
                res.body['servingSizes'].length.should.be.equal(2);
                done();
            });
    });
    
});
