const authLib = require('/lib/xp/auth');
const portalLib = require('/lib/xp/portal');
const contextLib = require('/lib/context');

exports.findUserByEmail = function (email) {
    return contextLib.runAsAdmin(function () {
        return authLib.findUsers({
            count: 1,
            query: "userstorekey = '" + portalLib.getIdProviderKey() + "' AND email = '" + email + "'",
            includeProfile: true
        }).hits[0];
    });
};

