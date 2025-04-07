import path from 'path';
import fs from 'fs';
const all = {
    env: process.env.ENV || 'local',
    applicationContext: '/order-service',
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
        fileName: 'order-service.log',
        accessFileName: 'order-service-access.log',
        level: 'info',
    },
    
    secret_names: {},
    
};
const envBlock = fs.readFileSync(
    `./app/config/environment/${all.env}.json`,
    'utf-8',
);
export default Object.assign(all, JSON.parse(envBlock));
