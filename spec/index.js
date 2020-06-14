
const path = require('path');
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
const apiSpec = path.join(__dirname, 'openapi.json');

module.exports.init = (app) => {
    return new OpenApiValidator({
        apiSpec,
        operationHandlers: path.join(__dirname),
        validateResponses: true
    }).install(app);
};