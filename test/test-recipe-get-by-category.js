process.env.NODE_ENV = 'test';

// Axios for the request to be made to the server
const axios = require('axios');

// Test module imports.
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

// Set up the response validator
const chaiResponseValidator = require('chai-openapi-response-validator');

// Load an OpenAPI file (YAML or JSON) into this plugin
// NOTE This has to be the full spec.json that we are building up dynamically on the server.
// Should consider writing a little util function that would get the spec every time ther server starts up for
// testing to make sure we have the latest and the tests don't fail.  This would require some infrastructure be
// put in place to ensure that it's only happening on the test sever spin up.
chai.use(chaiResponseValidator('/home/michael/Desktop/Programming/RecipeApp/RecipeBookServer/spec/full_spec.json'));

describe('All recipe endpoints with an empty database', () => {
    
    it('Should return a single recipe that has the category of Grain', async function() {
        
        const res = await axios.get('http://localhost:3000/v1/getRecipesByCategory?list=grain');
        
        expect(res.status).to.equal(200);
        expect(res.data.length).to.equal(1);
        
        expect(res).to.satisfyApiSpec;
    });

});
