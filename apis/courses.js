const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('groceryList');
const Promise = require('bluebird');
const unitConverter = require('../utils/unit-converter');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
exports.getAllCourses = async (db, req, res) => {
    debug("In courses");

    var query = {};
    
    let courses = await db.collection("courses").find(query).toArray();
    if (!courses || courses.length == 0)
    {
	return res.status(404).send({msg: 'There are currently no courses in the database.'});
    }
    return res.status(200).send({ title: 'All Cuisines', courses: courses });

};
