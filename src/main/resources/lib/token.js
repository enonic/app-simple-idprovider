var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var contextLib = require('/lib/context');

exports.isTokenValid = function (token) {
    var user = findUserByToken(token);
    if (user) {
        var timestamp = user.profile.userpwd.reset.timestamp;
        if ((timestamp - Date.now()) < 86400000) {
            return true;
        } else {
            removeToken(user.key);
        }
    }
    return false;
};

exports.findUserByToken = function (token) {
    return findUserByToken(token);
}

//exports.getUserInfo = function (userKey) {
//    var userInfo = authLib.getProfile({
//        key: userKey,
//        scope: "userpwd.reset"
//    });
//    return userInfo;
//};

exports.generateToken = function (userKey) {
    var token = doGenerateToken();

    contextLib.runAsAdmin(function () {
        return authLib.modifyProfile({
            key: userKey,
            scope: "userpwd.reset",
            editor: function () {
                return {
                    token: token,
                    timestamp: Date.now()
                };
            }
        });
    });

    return token;
};

function removeToken(userKey) {
    authLib.modifyProfile({
        key: userKey,
        scope: "userpwd.reset",
        editor: function () {
            return null;
        }
    });
}

function findUserByToken(token) {
    return contextLib.runAsAdmin(function () {
        return authLib.findUsers({
            count: 1,
            query: "userstorekey = '" + portalLib.getUserStoreKey() + "' AND profile.userpwd.reset.token = '" + token + "'",
            includeProfile: true
        }).hits[0];
    });
};

function doGenerateToken() {
    var bean = __.newBean('com.enonic.app.simpleidprovider.TokenGeneratorService');
    return bean.generateToken();
}