var contextLib = require('/lib/xp/context');

exports.runAsAdmin = function (callback) {
    return contextLib.run({
        user: {
            login: 'su',   //TODO Change.
            userStore: 'system'
        }
    }, callback);
};