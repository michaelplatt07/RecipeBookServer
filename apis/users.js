const bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      debug = require('debug')('users'),
      crypto = require('crypto'),
      mongo = require('mongodb'),
      mailSubjects = require('../consts/mail-subjects.js'),
      mailBodyAlts = require('../consts/mail-bodies.js'),
      emailUtil = require('../utils/email.js');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
/**
 * @swagger
 *
 * /users/activate/:userid?:
 *   get:
 *     description: Activates a user account.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: The user was successfully activated.
 *       400:
 *         NoUserError: The user to be activated doesn't exist.
 *     example:
 *       /users/activate/1234
 */
exports.activateUserAccount = async (db, req, res) => {
    debug("In activateUser");

    const query = {};
    query._id =  new mongo.ObjectID(req.params.userid);
    
    let result = await db.collection('users').findOne(query);

    if (!result) {
        return res.status(400).send({ message: 'No user account associated with activation link.'});
    }
    
    const newValues = { $set: { active: true }};
    await db.collection('users').updateOne(query, newValues);
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send({ message: 'User account successfully activated.'});   
};


/**
 * @swagger
 *
 * /users/delete/USERNAME:
 *   get:
 *     description: Deletes a user account from the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: The user was successfully deleted.
 *       400:
 *         NoUserError: The user to be deleted doesn't exist.
 *     example:
 *       /users/delete/1234
 */
exports.deleteUserAccount = async (db, req, res) => {
    debug("In deleteUser");

    try
    {
        let result = await db.collection('users').deleteOne({ username: req.params.userName });

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send({ message: 'Successfully deleted user account.'});
    }
    catch (err)
    {
	return res.status(400).send({ message: 'There was no user account with that name or you don\'t have permission to delete that account'});
    }
};


/**
 * ----------------
 * |     PUTS     |
 * ----------------
 */
/**
 * @swagger
 *
 * /users/register:
 *   post:
 *     description: Creates a new user account in the application
 *     produces:
 *       - application/json
 *     parameter:  
 *       - name: id TODO(map) UPDATE ME
 *         description: The Mongo ObjectID of the recipe to be updated.
 *         in: URL parameters
 *         require: true
 *         type: String
 *     responses:
 *       200:
 *         Success: The user account was successfully create.
 *       401:
 *         NoUsernameError: No username was provided on the create.
 *         NoPasswordError: No password was provided on the create.
 *     example:
 *       /users/register
 */
exports.createUserAccount = async (db, req, res) => {
    debug("In createUser");


    if (!req.body.username || req.body.username === "" || req.body.username === " ")
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(401).send({ message: 'Must include a username.' });
    }

    if (!req.body.password || req.body.password === "" || req.body.password === " ")
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(401).send({ message: 'Must include a password.' });
    }

    // NOTE(map) : We will need ot put the proper checks in here.
    if (!req.body.email || req.body.email === "" || req.body.email === " ")
    {
	res.setHeader('Content-Type', 'application/json');
	return res.status(401).send({ message: 'Must include an email.' });
    }

    var newUser = { username: req.body.username, password: "", email: req.body.email, active: false };

    bcrypt.genSalt(10, (err, salt) => {
	if (err)
	{
	    return next(err);
	}
	bcrypt.hash(req.body.password, salt, async (err, hash) => {
	    if (err) return next(err);
	    newUser.password = hash;
	    let result = await db.collection('users').insertOne(newUser);
            
            emailUtil.sendEmail(newUser.email, mailSubjects.ACCOUNT_CREATION, mailBodyAlts.ACCOUNT_CREATION, result.insertedId);
            
	    res.setHeader('Content-Type', 'application/json');
	    return res.status(200).send({ message: 'Successfully created user account.'});
	});
    });
};


/**
 * @swagger
 *
 * /users/login:
 *   post:
 *     description: Logs in the user
 *     produces:
 *       - application/json
 *     parameter: 
 *       - name: id TODO(map) UPDATE ME
 *         description: The Mongo ObjectID of the recipe to be updated.
 *         in: URL parameters
 *         require: true
 *         type: String
 *     responses:
 *       200:
 *         Success: You were able to log in with the credentials.
 *       401:
 *         Error: Error in the compare method from bcrypt library.
 *         InvalidCredentialsError: Either the username or password was incorrect.
 *     example:
 *       /users/login
 */
exports.loginUser = async (db, req, res) => {
    debug("In loginUser");
    
    var decipher = crypto.createDecipher('aes-128-cbc', 'baseSecret');
    var decryptedPass = decipher.update(req.body.password, 'hex', 'utf8');
    decryptedPass += decipher.final('utf8');
    
    let user = await db.collection('users').findOne({ username: req.body.username });
    
    if (!user.active)
    {
	return res.status(401).send({ message: 'User is not currently active.' });
    }

    bcrypt.compare(decryptedPass, user.password, (err, success) => {
	if (err)
	{
            return res.status(401).send({ message: 'Something went wrong.' });
	}
	if (success === true)
	{
            const payload = { id: user.username };
	    const token = jwt.sign(payload, new Buffer('basicSecret', 'base64'));
	    return res.status(200).send({ token: token, message: 'Successfully logged in.' });
	}

        return res.status(401).send({ message: 'Invalid username or password.' });
    });
};
