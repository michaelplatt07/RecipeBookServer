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

// Crypto for hashing password
const crypto = require('crypto');


describe('User registration.', () => {
    before(async () => {
	await db.connect();
        await db.dropAllCollections();
	
	await db.getDb().createCollection('users');
    });

    
    it('Should fail with no username being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({})
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include a username.');
		done();
	    });
    });

    it('Should fail with empty username being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "" })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include a username.');
		done();
	    });
    });

    it('Should fail with space for username being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: " " })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include a username.');
		done();
	    });
    });

    it('Should fail with no password being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "testUser" })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include a password.');
		done();
	    });
    });

    it('Should fail with a blank password being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "testUser", password: "" })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include a password.');
		done();
	    });
    });

    it('Should fail with no email being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "testUser", password: "test1234" })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include an email.');
		done();
	    });
    });

    it('Should fail with empty email being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "testUser", password: "test1234", email: "" })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include an email.');
		done();
	    });
    });

    it('Should fail with blank email being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "testUser", password: "test1234", email: " " })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include an email.');
		done();
	    });
    });
    
    it('Should create the user.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "testUser", password: "test1234", email: "test@test.com" })
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['message'].should.be.equal('Successfully created user account.');
		done();
	    });
    });

});


describe('User deletion and logging in.', () => {
    before(async () => {
	await db.connect();
        await db.dropAllCollections();
	
	await db.getDb().createCollection('users');
        
        await db.getDb().collection('users').insertOne(testFixtures.sampleUser);
    });
    
    it('Should fail because the user account has not been activated.', (done) => {
	const password = "test1234";
	const cipher = crypto.createCipher('aes-128-cbc', 'baseSecret');
	var encryptedPass = cipher.update(password, 'utf8', 'hex');
	encryptedPass += cipher.final('hex');
	
	chai.request(server)
	    .post('/users/login')
	    .send({ username: "testUser", password: encryptedPass })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('User is not currently active.');
		done();
	    });
    });

    it('Should fail because the user account does not exist.', (done) => {
        chai.request(server)
	    .get('/users/activate/5c080b0e92b3f41495100000')
	    .end((err, res) => {
		res.should.have.status(400);
		res.body['message'].should.be.equal('No user account associated with activation link.');
		done();
	    });
    });

    it('Should activate the user account.', (done) => {
        chai.request(server)
	    .get('/users/activate/5c080b0e92b3f41495142cf4')
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['message'].should.be.equal('User account successfully activated.');
		done();
	    });
    });

    it('Should allow user to log in.', (done) => {
	const password = "testPass";
	const cipher = crypto.createCipher('aes-128-cbc', 'baseSecret');
	var encryptedPass = cipher.update(password, 'utf8', 'hex');
	encryptedPass += cipher.final('hex');
	
	chai.request(server)
	    .post('/users/login')
	    .send({ username: "testUser", password: encryptedPass })
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['message'].should.be.equal('Successfully logged in.');
		done();
	    });
    });
    
});

