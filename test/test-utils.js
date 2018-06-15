var expect = require('chai').expect;

var utils = require('../utils/utility-functions');

describe('convertTextToSearch()', function () {
  it('Should return the correct underscore and lower case version of the string passed in.', function () {
      var textFriendlyName = 'Sample Recipe Number 1';
      var expectedOutputString = 'sample_recipe_number_1';

      var outputString = utils.convertTextToSearch(textFriendlyName);;

      expect(outputString).to.be.equal(expectedOutputString);
  });
});
