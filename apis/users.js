const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const debug = require('debug')('users');
const crypto = require('crypto')

/**
 * ----------------
 * |     PUTS     |
 * ----------------
 */
// TODO(map) : See about returning a correct error here instead of just breaking.
// TODO(map) : Add regex to check for any number of white spaces only being used.
exports.createUserAccount = async (db, req, res) => {
    debug("In createUser");


    if (!req.body.username || req.body.username === "" || req.body.username === " ")
    {
	res.setHeader('Content-Type', 'application/json')
	return res.status(401).send({ message: 'Must include a username.' })
    }

    if (!req.body.password || req.body.password === "" || req.body.password === " ")
    {
	res.setHeader('Content-Type', 'application/json')
	return res.status(401).send({ message: 'Must include a password.' })
    }

    var newUser = { username: req.body.username, password: "" }

    bcrypt.genSalt(10, (err, salt) => {
	if (err)
	{
	    return next(err)
	}
	bcrypt.hash(req.body.password, salt, async (err, hash) => {
	    if (err) return next(err)
	    newUser.password = hash
	    let result = await db.collection('users').insertOne(newUser)

	    res.setHeader('Content-Type', 'application/json')
	    return res.status(200).send({ message: 'Successfully created user account.'})
	});
    });
}


// TODO(map) : Write test cases for this.
exports.loginUser = async (db, req, res) => {
    debug("In loginUser")

    var decipher = crypto.createDecipher('aes-128-cbc', 'baseSecret')
    var decryptedPass = decipher.update(req.body.password, 'hex', 'utf8')
    decryptedPass += decipher.final('utf8');
    
    let user = await db.collection('users').findOne({ username: req.body.username })
    bcrypt.compare(decryptedPass, user.password, (err, success) => {
	if (err)
	{
	    return res.status(401).send({ message: 'Something went wrong.' })
	}
	if (success === true)
	{
	    const payload = { id: user.username }
	    const token = jwt.sign(payload, 'basicSecret');
	    return res.status(200).send({ token: token, message: 'Successfully logged in.' })
	}
	return res.status(401).send({ message: 'Invalid username or password.' })
    })    
}


exports.deleteUserAccount = async (db, req, res) => {
    debug("In deleteUser");

    try
    {
    let result = await db.collection('users').deleteOne({ username: req.params.userName })

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).send({ message: 'Successfully deleted user account.'})
    }
    catch (err)
    {
	return res.status(400).send({ message: 'There was no user account with that name or you don\'t have permission to delete that account'})
    }
}
