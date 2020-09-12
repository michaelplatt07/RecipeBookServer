const _ = require('lodash');
const fs = require('fs');
const path = require('path');

exports.stubbedVisionResponse = () => {
	return fs.readFileSync(path.join(__dirname, '..', 'dumps/sample_vision_response.json'), 'utf8');
};

exports.unrefinedRecipeBuildAttempt = (rawRecipeDataResponse) => {
	const rawRecipeData = JSON.parse(rawRecipeDataResponse)['responses'][0]['textAnnotations'][0]['description'];
	return rawRecipeData;
};
