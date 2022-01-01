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

    /*
                 'steps': ['Sprinkle\n strips of sirloin with garlic powder to taste. In a large skillet over \nmedium heat, heat the vegetable oil and brown the seasoned beef strips. \nTransfer to a slow cooker.', 'Mix\n bouillon cube with hot water until dissolved, then mix in cornstarch \nuntil dissolved. Pour into the slow cooker with meat. Stir in onion, \ngreen peppers, stewed tomatoes, soy sauce, sugar, and salt.', 'Cover, and cook on High for 3 to 4 hours, or on Low for 6 to 8 hours.'], 'ingredients': ['2 2 pounds beef sirloin, cut into inch strips', ' garlic powder to taste', '3 tablespoons vegetable oil', '1 cube beef bouillon', '1/4 cup hot water', '1 tablespoon cornstarch', '1/2 cup chopped onion', '2 large green bell peppers, roughly chopped', '1 (14.5 ounce) can stewed tomatoes, with liquid', '3 tablespoons soy sauce', '1 teaspoon white sugar', '1 teaspoon salt']}
                 */
    it('Return a formatted recipe from AllRecipes.', (done) => {
        chai.request(server)
            .post('/recipes/import')
            .set({ 'Authorization': token })
            .send({'url': 'sample_websites/allrecipes_recipe.html'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body['recipeData']['text_friendly_name'].should.be.equal("Slow-Cooker Pepper Steak");
                res.body['recipeData']['description'].should.be.equal("Very\n tender and flavorful, this recipe is one of our family's favorites. \nIt's great to make ahead of time in the slow cooker and then serve over \nrice, egg noodles, or chow mein.");
                res.body['recipeData']['prep_time']['minutes'].should.be.equal('20');
                res.body['recipeData']['cook_time']['minutes'].should.be.equal('4');
                res.body['recipeData']['serving_sizes'].should.be.equal('6');
                done();
            });
    });

    /*
                'steps': ['Preheat the oven to 350 degrees F.', 'Dice the potatoes and boil in a pot of water until fork \ntender, 25 to 30 minutes. Drain and return to the pan over low heat. \nMash the potatoes for 5 minutes to allow a lot of the steam to escape.', 'Add the butter, cream cheese, half-and-half, cream, some \nsalt, pepper and roasted garlic. Stir/mash to combine. Test and adjust \nthe seasonings.', 'Spread the potatoes into a large buttered baking dish. Dot\n the top with butter. Bake until heated through, about 30 minutes.'], 'ingredients': ['5 pounds russet or Yukon gold potatoes, peeled and rinsed', '1 1/2 sticks regular
     * salted butter, plus more for dotting', '8 ounces cream cheese, softened', '1/4 cup or so half-and-half', 'A splash heavy cream', 'Salt and black pepper', '3 to 5 heads roasted garlic']}
     */
    it('Return a formatted recipe from FoodNetwork.', (done) => {
        chai.request(server)
            .post('/recipes/import')
            .set({ 'Authorization': token })
            .send({'url': 'sample_websites/foodnetwork_recipe.html'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body['recipeData']['text_friendly_name'].should.be.equal("Roasted Garlic Mashed Potatoes");
                res.body['recipeData']['description'].should.be.equal("");
                res.body['recipeData']['cook_time']['minutes'].should.be.equal('75');
                res.body['recipeData']['serving_sizes'].should.be.equal('8');
                done();
            });
    });

});
