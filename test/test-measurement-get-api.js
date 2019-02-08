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


describe('All measurements endpoints with no data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('measurements');
    });

    it('Should return 404 because there are no measurements.', (done) => {
        chai.request(server)
            .get('/measurements')
            .end((err, res) => {
                res.should.have.status(404);
                res.body['msg'].should.be.equal('There are currently no measurements in the database.');
                done();
            });
    });
    
});

describe('All measurements endpoints with data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();
        
        await db.getDb().createCollection('measurements');        
	await db.getDb().collection('measurements').insertMany(testFixtures.sampleMeasurements);
    });

    it('Should return four measurements because we hit the return all endpoint.', (done) => {
        chai.request(server)
            .get('/measurements')
            .end((err, res) => {
                res.should.have.status(200);
                res.body['measurements'].length.should.be.equal(4);
                done();
            });
    });
    
});
