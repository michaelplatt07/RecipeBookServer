
const path = require('path');
const express = require('express');
const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

module.exports.init = (app) => {
    const apiSpec = require('./builder').buildSpec();
    app.get('/spec', (req, res) => res.status(200).send(apiSpec));
    return new OpenApiValidator({
        apiSpec,
        operationHandlers: path.join(__dirname),
        validateResponses: true
    }).install(app);
};
