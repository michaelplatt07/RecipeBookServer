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


describe('All course endpoints with no data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('courses');
    });

    it('Should return 404 because there are no courses.', (done) => {
        chai.request(server)
            .get('/courses')
            .end((err, res) => {
                res.should.have.status(404);
                res.body['msg'].should.be.equal('There are currently no courses in the database.');
                done();
            });
    });
    
});

describe('All courses endpoints with data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();
        
        await db.getDb().createCollection('courses');        
	await db.getDb().collection('courses').insertMany(testFixtures.sampleCourses);
    });

    it('Should return two courses because we hit the return all endpoint.', (done) => {
        chai.request(server)
            .get('/courses')
            .end((err, res) => {
                res.should.have.status(200);
                res.body['courses'].length.should.be.equal(2);
                done();
            });
    });
    
});
