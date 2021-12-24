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


describe('All ingredient endpoints with no data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('ingredients');
    });

    it('Should return 404 because there are no ingredients.', (done) => {
        chai.request(server)
            .get('/ingredients')
            .end((err, res) => {
                res.should.have.status(404);
                res.body['msg'].should.be.equal('There are currently no ingredients in the database.');
                done();
            });
    });
    
});

describe('All ingredient endpoints with data in database', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('ingredients');
        await db.getDb().collection('ingredients').insertMany(testFixtures.sampleIngredients);
    });

    it('Should get three ingredients back.', (done) => {
        chai.request(server)
            .get('/ingredients')
            .end((err, res) => {
                res.should.have.status(200);
                res.body['title'].should.be.equal('All Ingredients');
                res.body['ingredients'].length.should.be.equal(4);
                res.body['ingredients'][0]['name'].should.be.equal('elbow_noodles');
                res.body['ingredients'][1]['name'].should.be.equal('cheddar_cheese');
                res.body['ingredients'][2]['name'].should.be.equal('gouda_cheese');
                res.body['ingredients'][3]['name'].should.be.equal('milk');
                 done();
            });
    });
    
});


