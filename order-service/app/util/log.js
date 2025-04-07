import log4js from 'log4js';
log4js.configure('log4js.config.json');
export class Logs {
    constructor() {
        let debugLevel = process.env.DEBUG_LEVEL || 'DEBUG';
        if (process.env.ENV === 'prod') {
            debugLevel = 'DEBUG';
        }
        this.logger = log4js.getLogger();
        this.logger.level = debugLevel;
    }
    debug(message) {
        this.logger.debug(message);
    }
    info(message) {
        this.logger.info(message);
    }
    error(message) {
        this.logger.error(message);
    }
    warn(message) {
        this.logger.warn(message);
    }
    fatal(message) {
        this.logger.fatal(message);
    }
    trace(message) {
        this.logger.trace(message);
    }
}
