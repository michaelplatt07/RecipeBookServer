const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const SPEC_DIR = './openapi'
const ROUTE_SPECS = `${SPEC_DIR}/routes/`;
const COMPONENT_SPECS = `${SPEC_DIR}/components`;

module.exports.buildSpec = () => ({
    openapi: "3.0.3",
    info: require(`${SPEC_DIR}/info.json`),
    servers: require(`${SPEC_DIR}/servers.json`),
    paths: buildPaths(ROUTE_SPECS),
    components: buildComponents()
});

const buildPaths = (apiDir, paths = {}) => {
    const normalizedPath = path.join(__dirname, apiDir);
    fs.readdirSync(normalizedPath, { withFileTypes: true }).forEach((item) => {

        if (item.isFile()) {
            const routeObj = require(apiDir + item.name);
            const routeName = path.parse(item.name).name;

            Object.keys(routeObj).forEach((value => {
                _.set(routeObj[value], 'operationId', routeName);
                _.set(routeObj[value], 'x-eov-operation-id', routeName);
                _.set(routeObj[value], 'x-eov-operation-handler', apiToRouteHandler(apiDir, routeName));
            }));


            paths[`${apiToRoutePath(apiDir)}${routeName}`] = routeObj;
        } else {
            return buildPaths(`${apiDir}${item.name}/`, paths);
        }

    });
    return paths;
};

const apiToRoutePath = (apiDir) => apiDir.replace(ROUTE_SPECS, '/');
const apiToRouteHandler = (apiDir, routeName) => `${apiDir.replace(SPEC_DIR, '..')}${routeName}`;

const buildComponents = () => ({
    schemas: buildSchemas(`${COMPONENT_SPECS}/schemas/`),
    securitySchemes: require(`${COMPONENT_SPECS}/securitySchemes.json`)
});

const buildSchemas = (schemaDir) => {
    const schemas = {};
    const normalizedPath = path.join(__dirname, schemaDir);
    fs.readdirSync(normalizedPath).forEach((item) => {
        const schemaObj = require(`${schemaDir}${item}`);
        const schemaName = path.parse(item).name;
        schemas[schemaName] = schemaObj;
    });
    return schemas;
};



