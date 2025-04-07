const config = require('../config/environment');

module.exports = {
    getSSOClientId: function () {
        return process.env[config.secret_names.sso_client_id];
    },
    getSSOClientKey: function () {
        return process.env[config.secret_names.sso_client_key];
    },
    getAPIGWClientId: function () {
        return process.env[config.secret_names.api_gw_client_id];
    },
    getAPIGWClientKey: function () {
        return process.env[config.secret_names.api_gw_client_key];
    },
};
