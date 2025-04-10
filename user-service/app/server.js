import restify from 'restify';
import chalk from 'chalk';
import log4js from 'log4js';
import bodyParser from 'body-parser';
import Setup from './config/setup-context.js';
import os from 'os';
import { Healthcheck } from './routes/health-check/health-check.js';
import { UsersRoutes } from './routes/users/users-route.js';
import { AccountsRoutes } from './routes/account/accounts-route.js';


/**
 * create Web Server
 * @Port: SERVER_PORT || 8085
 * @log-level: DEBUG_LEVEL || 'DEBUG
 */

let debugLevel = process.env.DEBUG_LEVEL || 'DEBUG';
if (process.env.ENV === 'prod') {
    debugLevel = 'DEBUG';
}
log4js.configure('log4js.config.json');
const logger = log4js.getLogger();
logger.level = debugLevel;

/**
 * Create web Server
 */
const server = restify.createServer();
const port = process.env.SERVER_PORT || 8085;
const ip = getIPAddress();
logger.debug(`the ip address is ${ip}`);
// logger.info(`we are running version ${packageConfig.version}`);
logger.debug(`the env is ${process.env.ENV}`);

/**
 * register handlers
 */

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('credentials', 'include');
    return next();
});
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//----------------------------------------------------------------------------------------------------------------------
// handle unknown methods ----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
function unknownMethodHandler(req, res) {
    if (req.method.toLowerCase() === 'options') {
        let allowHeaders = [
            'Access-Control-Allow-Credentials',
            'Accept',
            'Accept-Version',
            'Content-Type',
            'Api-Version',
            'Origin',
            'X-Requested-With',
        ];

        if (res.methods.indexOf('OPTIONS') === -1) {
            res.methods.push('OPTIONS');
        }
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', allowHeaders);
        res.header(
            'Access-Control-Allow-Methods',
            'POST,GET,PUT,DELETE,OPTIONS',
        );
        res.header('Access-Control-Allow-Origin', '*');

        return res.send(200);
    } else {
        return res.send('Method not allowed');
    }
}
server.on('MethodNotAllowed', unknownMethodHandler);

init().then(() => {
    server.listen(port, startServer);
    setTimeout(() => {
        // consulRegistration.registerService('system-api', ip, port);
    }, 5000);
    /**
     * Import routes
     */
    new Healthcheck(server);
    new UsersRoutes(server);
    new AccountsRoutes(server);
    

});

/**
 * Start Server
 */

function startServer() {
    logger.debug(`${server.name} listen at ${server.url}`);
    console.log(chalk.bgGreen('***************************************'));
    console.log(chalk.bgGreen(`${server.name} listen at ${server.url}`));
    console.log(chalk.bgGreen('***************************************'));
}
export async function init() {
    const setup = new Setup();
    await setup.readProperties();
}
export async function stop() {
    server.close();
}

function getIPAddress() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (let k in interfaces) {
        for (let k2 in interfaces[k]) {
            let address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    addresses.push('127.0.0.1');
    return addresses;
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
