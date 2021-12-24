// Setting order of the tests to ensure the dependencies of one test having been ran is done before running the other.
require('./test-user-api');
require('./test-recipe-get-api');
require('./test-recipe-put-api');
require('./test-cuisine-get-api');
require('./test-scraper');
require('./test-measurement-get-api');
require('./test-course-get-api');
require('./test-category-get-api');
require('./test-ingredient-get-api');
require('./test-serving-size-get-api');
require('./test-utils');
require('./test-converter');
