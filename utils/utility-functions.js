const _ = require('lodash');

/**
 * Takes a value and an array of mongo db entries and checks to see if the ID exists.  This is just a small util
 * function that I felt like pulling out and could probably be optimized later.
 */
exports.mongoIdInArray = (value, anArray) => {
    if (anArray.length == 0)
    {
	return false;
    }
    for (let i = 0; i < anArray.length; ++i)
    {
	if (anArray[i]['_id'].equals(value))
	{
	    return true;
	    break;
	}   
    }
    return false;
};


/**
* Converts a text friendly name to the searchable name
*/
exports.convertTextToSearch = (textFriendlyString) => {
    return textFriendlyString.replace(/ /g, '_').toLowerCase();
};


/**
* Creates the short description of the recipe
*/
exports.createShortDescription = (description) => {
    return description.substring(0, 100) + "...";
};


/**
 * Checks the data and ensures the correc information is available and no constraints are violated.  If there is
 * a violation in the data we build up an error report to return.
 */
exports.checkRecipePostData = (jsonData) => {
    var errMsgDict = {};

    if (!jsonData['text_friendly_name'] || jsonData['text_friendly_name'] == '')
    {
	errMsgDict['noNameError'] = 'Please include a name in your recipe.';
    }

    if (!jsonData['ingredients'] || jsonData['ingredients'].length == 0)
    {
	errMsgDict['noIngredientsError'] = 'Please include a list of ingredients in your recipe.';
    }
    else
    {
	for (let i = 0; i < jsonData['ingredients'].length; ++i)
	{
	    if (!jsonData['ingredients'][i]['text_friendly_name'] || jsonData['ingredients'][i]['text_friendly_name'] == '')
	    {
		errMsgDict['noIngredientNameError'] = 'One ore more of the ingredients did not have a name given.';
		break;
	    }

	    if (!jsonData['ingredients'][i]['quantity'] || jsonData['ingredients'][i]['quantity'] == '')
	    {
		errMsgDict['noIngredientQuantityError'] = 'One or more of the ingredients did not have a quantity given.';
		break;
	    }

	    if (!jsonData['ingredients'][i]['measurement'] && jsonData['ingredients'][i]['measurement'] !== '')
	    {
		errMsgDict['noIngredientMeasurementError'] = 'One or more of the ingredients did not have a measurement given.';
		break;
	    }
	}
    }
    
    if (!jsonData['steps'] || jsonData['steps'].length == 0)
    {
	errMsgDict['noStepsError'] = 'Please include steps in your recipe.';
    }

    if(!jsonData['courses'] || jsonData['courses'].length == 0)
    {
	errMsgDict['noCoursesError'] = 'Please include at least one course this recipe belongs to.';
    }

    if (!jsonData['prep_time'])
    {
	errMsgDict['noPrepTimeError'] = 'Please include a prep time.';
    }

    if (!jsonData['cook_time'])
    {
	errMsgDict['noCookTimeError'] = 'Please include a cook time.';
    }

    if (!jsonData['cuisines'] || jsonData['cuisines'].length == 0)
    {
	errMsgDict['noCuisinesError'] = 'Please include one or more cuisines this dish is a part of.';
    }

    if (!jsonData['categories'] || jsonData['categories'].length == 0)
    {
	errMsgDict['noCategoriesError'] = 'Please include at least one category for the dish.';
    }

    if (!jsonData['serving_sizes'])
    {
	errMsgDict['noServingSizesError'] = 'Please select a serving size.';
    }

    if (_.isNil(jsonData['searchable']))
    {
	errMsgDict['noSearchableError'] = 'Please select if you want the recipe to be private or public.';
    }

    if (!jsonData['description'])
    {
	errMsgDict['noDescriptionError'] = 'Please include a description of the dish.'; 
    }
    
    return errMsgDict;
};


/**
 * Method to check if a measurment exists in the list of measurements that are returned for a mongo query.  This is
 * used in the addIngredients method and might be re-used elsewhere.
 */
exports.measurementInDb = (aMeasurement, measurementList) => {
    var duplicate = false;
    for (let i = 0; i < measurementList['measurement_ratios'].length; ++i)
    {
	// Searching for duplicates and if so update the information.
	if (measurementList['measurement_ratios'][i]['measurement'] == aMeasurement)
	{
	    duplicate = true;
	    measurementList['measurement_ratios'][i]['count'] += 1;
	    measurementList['total_measurements_added'] += 1;
	    break;
	}
    }

    if (!duplicate) // This is a new measurement and has to be added to the list.
    {
	var aRatio = { measurement: aMeasurement, percentage: 0, count: 1 };
	measurementList['measurement_ratios'].push(aRatio);
	measurementList['total_measurements_added'] += 1;
    }

    // Recaclulate percentages and update most used.
    for (let i = 0; i < measurementList['measurement_ratios'].length; ++i) 
    {
	if (i > 0)
	{
	    if ((measurementList['measurement_ratios'][i - 1]['percentage'] < measurementList['measurement_ratios'][i]['percentage'])  && (measurementList['measurement_ratios'][i]['measurement'] !== '')) // The previous measurement has a higher percentage of being used.
	    {
		measurementList['most_used_measurement'] = measurementList['measurement_ratios'][i]['measurement'];
	    }
	    else if ((measurementList['measurement_ratios'][i - 1]['percentage'] > measurementList['measurement_ratios'][i]['percentage']) && (measurementList['measurement_ratios'][i - 1]['measurement'] !== ''))
	    { // The later measurement has a higher percentage of being used.
		measurementList['most_used_measurement'] = measurementList['measurement_ratios'][i -1]['measurement'];
	    }
	    else
	    {
		// Do nothing because there was no enough of a change in the percentages
	    }
	}

	measurementList['measurement_ratios'][i]['percentage'] = Math.floor(measurementList['measurement_ratios'][i]['count'] / measurementList['total_measurements_added'] * 100);
    } 
       
    return measurementList;
};


/**
 * This method does a number of things.  It checks to see if the ingredient already exists in the collection.  In
 * the event that it doesn't, we add the ingredient.  If it does, we get the units, we add +1 to the unit counter,
 * and update the most used unit if needed.
 *
 * This will ensure the most commonly used unit is what we build the grocery list up with.
 */
exports.insertIngredients = (db, ingredientList) => {
    ingredientList.forEach((ingredient) => {

	var query = {};
	query.name = this.convertTextToSearch(ingredient['text_friendly_name']);
	db.collection('ingredients').findOne(query, (err, results) => {
	    if (err)
	    {
		throw err;
	    }
	    else if (results != null) // The ingredient was seen before.
	    {
		results = this.measurementInDb(ingredient['measurement'], results);
		db.collection('ingredients').updateOne({_id: results['_id']}, {$set: results}, (err, res) => {
		    if (err)
		    {
                        console.log(err);
			res.status(500).send({ message: 'Failed to update data.' });			
		    }
		});
	    }
	    else // New ingredient
	    {
		ingredient['most_used_measurement'] = ingredient['measurement'];
		ingredient['total_measurements_added'] = 1;
		ingredient['measurement_ratios'] = [{measurement: ingredient['measurement'], percentage: 1, count: 1}];
		delete ingredient['quantity'];
		delete ingredient['measurement'];
		db.collection('ingredients').insertOne(ingredient, (err, res) => {
		    if (err)
		    {
			res.status(500).send({ message: 'Failed to insert data.' });
		    }
		});
	    }
	});	    
    });
};
