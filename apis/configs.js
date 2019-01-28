const debug = require('debug')('configs');
const config = require('config');
const serverConfigInfo = config.get('serverConfig');

/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
/**
 * @swagger
 *
 * /config/routes:
 *   get:
 *     description: Gets the swagger dump of the routes and other data..
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: Returns the list of routes with swagger documentation.
 *     example:
 *       /config/routes
 */
exports.getAllRoutes = async (swaggerSpec, req, res) => {
    debug("In getRoutes");

    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
};


/**
 * @swagger
 *
 * /config/configurations:
 *   get:
 *     description: Gets all configurations that would be necessary for the application.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         Success: Returns all necessary configurations.
 *     example:
 *       /config/configurations
 */
exports.getConfigurations = async (db, req, res) => {
    debug("In getConfigurations");

    res.setHeader('Content-Type', 'application/json');
    res.send(serverConfigInfo);
};
