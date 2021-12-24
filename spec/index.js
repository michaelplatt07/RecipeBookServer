// TODO(map) Uncomment when fixed.
/*
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
    })
    .install(app)
    .then(() => {
        app.use((err, req, res, next) => {
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
    });
};
*/
