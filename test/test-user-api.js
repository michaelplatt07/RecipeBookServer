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


describe('User registration, deletion, and logging in.', () => {
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

    it('Should fail with no username being supplied.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "" })
	    .end((err, res) => {
		res.should.have.status(401);
		res.body['message'].should.be.equal('Must include a username.');
		done();
	    });
    });

    it('Should fail with no username being supplied.', (done) => {
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

    
    it('Should create the user.', (done) => {
	chai.request(server)
	    .post('/users/register')
	    .send({ username: "testUser", password: "test1234" })
	    .end((err, res) => {
		res.should.have.status(200);
		res.body['message'].should.be.equal('Successfully created user account.');
		done();
	    });
    });

    it('Should allow the user to log in.', (done) => {
	const password = "test1234";
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

})
