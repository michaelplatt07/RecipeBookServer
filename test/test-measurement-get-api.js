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


describe('All measurements endpoints with no data in database', () => {
    beforeEach(async () => {
        let exists = await db.collectionExists('measurements');
        if (exists) {
            db.getDb().dropCollection('measurements', (err, results) => {
                if (err) {
                    throw err;
                }
            });
        }
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
    beforeEach(async () => {
        const measurements = [{name: "Tbsp"},{name: "c"},{name: "tsp"},{name: "oz"}];
        let exists = await db.collectionExists('measurements');
        if (exists) {
            db.getDb().dropCollection('measurements', (err, results) => {
                if (err) {
                    throw err;
                }
            });
        }
	
	await db.getDb().collection('measurements').insertMany(measurements, (err, result) => {
	});
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
