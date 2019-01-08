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


describe('All cuisine endpoints with no data in database', () => {
    beforeEach(async () => {
        let exists = await db.collectionExists('cuisines');
        if (exists) {
            db.getDb().dropCollection('cuisines', (err, results) => {
                if (err) {
                    throw err;
                }
            });
        }
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
    beforeEach(async () => {
        const cuisines = [{name: "American", search_name: "american"},{name: "Japanese", search_name: "japanese"}];
        let exists = await db.collectionExists('cuisines');
        if (exists) {
            db.getDb().dropCollection('cuisines', (err, results) => {
                if (err) {
                    throw err;
                }
            });
        }
	
	await db.getDb().collection('cuisines').insertMany(cuisines, (err, result) => {
	});
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
