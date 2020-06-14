
const path = require('path');
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

module.exports.init = (app) => {
    const apiSpec = require('./builder').buildSpec();
    return new OpenApiValidator({
        apiSpec,
        operationHandlers: path.join(__dirname),
        validateResponses: true
    }).install(app);
};
