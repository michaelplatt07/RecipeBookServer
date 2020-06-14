const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const info = require('./openapi/info.json');
const servers = require('./openapi/servers.json');

module.exports.buildSpec = () => ({
  openapi: "3.0.3",
  info,
  servers,
  paths: buildPaths('./openapi/routes/'),
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
                _.set(routeObj[value], 'x-eov-operation-handler', apiToRouteHandler(apiDir) + routeName);
            }));

            
            paths[apiToRoute(apiDir) + routeName] = routeObj;
        } else {
            return buildPaths(apiDir+item.name + '/', paths);
        }
        
    });
    return paths;
};

const apiToRoute = (apiDir) => apiDir.replace('./openapi/routes/', '/');
const apiToRouteHandler = (apiDir) => apiDir.replace('./openapi', '..');


const buildComponents = () => {
     //TODO: proper implementation from seperate object definitions
     return require('./openapi/components.json');
};



