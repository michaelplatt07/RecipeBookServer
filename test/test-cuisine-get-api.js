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


describe('All cuisine endpoints with no data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('cuisines');
    });

    it('Should return 404 because there are no cuisines.', (done) => {
        chai.request(server)
            .get('/cuisines')
            .end((err, res) => {
                res.should.have.status(404);
                res.body['msg'].should.be.equal('There are currently no cuisines in the database.');
                done();
            });
    });

});

describe('All cuisine endpoints with data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('cuisines');
        await db.getDb().collection('cuisines').insertMany(testFixtures.sampleCuisines);
    });

    it('Should return two cuisines because we hit the return all endpoint.', (done) => {
        chai.request(server)
            .get('/cuisines')
            .end((err, res) => {
                res.should.have.status(200);
                res.body['cuisines'].length.should.be.equal(2);
                done();
            });
    });

});
