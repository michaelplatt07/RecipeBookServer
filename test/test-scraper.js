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

let token = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RVc2VyIiwiaWF0IjoxNTUyOTIxODQ4fQ.Ii3QotT8Uct9evShnHtbm7cEGco1fbK_zgGjZ_liZz4";

describe('All scraping endpoints', () => {
    before(async () => {
        await db.connect();
        await db.dropAllCollections();

        await db.getDb().createCollection('users');
        await db.getDb().collection('users').insertOne(testFixtures.sampleUser);       
    });

    it('Return an error message because the scraper is not implmented.', (done) => {
        chai.request(server)
            .post('/recipes/import')
            .set({ 'Authorization': token })
            .send({'url': 'https://www.twitter.com'})
            .end((err, res) => {
                res.should.have.status(404);
                res.body['msg'].should.be.equal('Scraping not supported for this site yet');
                done();
            });
    });

    // TODO(map) Should there be tests that hit the site through the endpoint here?
});
