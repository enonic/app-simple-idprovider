var authLib = require('/lib/xp/auth');

exports.isTokenValid = function (userKey, token) {

    var userInfo = authLib.getProfile({
        key: userKey,
        scope: "simpleidprovider"
    });
    return userInfo && userInfo.token && userInfo.token == token && (userInfo.timestamp - Date.now()) < 86400000
};

exports.getUserInfo = function (userKey) {
    var userInfo = authLib.getProfile({
        key: userKey,
        scope: "simpleidprovider"
    });
    return userInfo;
};

exports.generateToken = function (userKey) {
    var token = doGenerateToken();

    var userInfo = authLib.modifyProfile({
        key: userKey,
        scope: "simpleidprovider",
        editor: function () {
            return {
                token: token,
                timestamp: Date.now()
            };
        }
    });

    return token;
};

function doGenerateToken() {
    var bean = __.newBean('com.enonic.app.simpleidprovider.TokenGeneratorService');
    return bean.generateToken();
}