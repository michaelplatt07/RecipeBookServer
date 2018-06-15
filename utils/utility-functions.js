/**
 * Takes a value and an array of mongo db entries and check to see if the ID exists.  This is just a small util
 * function that I felt like pulling out and could probably be optimized later.
 */
exports.valueInArray = (value, anArray) => {
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
exports.convertTextToSearch = (textFriendlyName) => {
    return textFriendlyName.replace(/ /g, '_').toLowerCase();
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

	    if (!jsonData['ingredients'][i]['measurement'] || jsonData['ingredients'][i]['measurement'] == '')
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
    else
    {
    }

    return errMsgDict;
};
