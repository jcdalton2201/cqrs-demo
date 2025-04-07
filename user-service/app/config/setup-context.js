import { Logs } from '../util/log.js';
import config from './environment/index.js';
import fs from 'fs';
const localImport = fs.readFileSync(
    './app/config/data/local-secrets.json',
    'utf-8',
);
const localConfig = JSON.parse(localImport);
const logger = new Logs();

export default class SetupContext {
    constructor() {
        logger.debug('creating setup context');
        this.init();
    }
    async init() {
        try {
            logger.debug(`token is ${token}`);
        } catch (error) {
            logger.error(error);
        }
    }
    async _readSecret(section) {
        try {
            const keys = Object.keys(section);
            for (let index = 0; index < keys.length; index++) {
                // const mg = await vault.read(`cubbyhole/${keys[index]}`);
                const mg = await this.getSecrets(keys[index]);
                console.log(mg);
                const secrets = Object.keys(mg);
                // const secrets = Object.keys(mg.data);
                secrets.forEach((secret) => {
                    section[keys[index]][secret] = mg[secret];
                });
            }
        } catch (error) {
            logger.error(error);
        }
    }
    async _readSecrets() {
        try {
            logger.debug(JSON.stringify(config.secret_names));
            await this._readSecret(config.secret_names);
        } catch (error) {
            logger.error(error);
        }
    }
    async readProperties() {
        try {
            logger.info('calling readproperties');
            await this._readSecrets();
        } catch (error) {
            logger.error(error);
        }
    }
    async getSecrets(key) {
        console.log(config.env);
        if (config.env === 'local') {
            return localConfig[key];
        }
        const valutData = vault.read(`cubbyhole/${key}`);
        return valutData.data;
    }
}
