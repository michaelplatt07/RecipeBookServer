const info = require('./openapi/info.json');
const servers = require('./openapi/servers.json');

module.exports.buildSpec = () => ({
  openapi: "3.0.3",
  info,
  servers,
  paths: buildPaths(),
  components: buildComponents()
});

const buildPaths = () => {
    //TODO: proper implementation from seperate route definitions
    return require('./openapi/paths.json');
};


const buildComponents = () => {
     //TODO: proper implementation from seperate object definitions
     return require('./openapi/components.json');
};


