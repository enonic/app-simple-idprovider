var authLib = require('/lib/xp/auth');

exports.get = function (req) {
    authLib.logout();
};