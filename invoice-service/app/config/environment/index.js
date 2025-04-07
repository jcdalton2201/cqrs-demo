import path from 'path';
import fs from 'fs';
const all = {
    env: process.env.ENV || 'local',
    applicationContext: '/invoice-service',
    apiApplicationContext: '/api',
    authApplicationContext: '/auth',
    root: path.normalize(path.dirname + '/../../..'),
    port: process.env.PORT || 8080,
    proxy: {
        host: 'none.com',
        port: 8099,
    },
    log_file_path: process.env.RESOLVED_LOG_PATH || 'logs',
    log: {
        type: 'file',
        fileName: 'invoice-service.log',
        accessFileName: 'invoice-service-access.log',
        level: 'info',
    },
    postgres: {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE
    },
    secret_names: {},
    
};
const envBlock = fs.readFileSync(
    `./app/config/environment/${all.env}.json`,
    'utf-8',
);
export default Object.assign(all, JSON.parse(envBlock));
