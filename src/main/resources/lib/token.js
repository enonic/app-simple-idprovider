var authLib = require('/lib/xp/auth');

exports.isTokenValid = function (userKey, token) {

    var userInfo = authLib.getUserExtraData({
        key: userKey,
        namespace: "com.enonic.app.simpleidprovider"
    });
    log.info("getUserExtraData:" + JSON.stringify(userInfo));
    return userInfo && userInfo.token && userInfo.token == token && (userInfo.timestamp - Date.now()) < 86400000
};

exports.getUserInfo = function (token) {
    return infoByToken[token];
};

exports.generateToken = function (userKey) {
    var token = doGenerateToken();

    var userInfo = authLib.modifyUserExtraData({
        key: userKey,
        namespace: "com.enonic.app.simpleidprovider",
        editor: function () {
            return {
                token: token,
                timestamp: Date.now()
            };
        }
    });
    log.info("modifyUserExtraData:" + JSON.stringify(userInfo));

    return token;
};

function doGenerateToken() {
    var bean = __.newBean('com.enonic.app.simpleidprovider.TokenGeneratorService');
    return bean.generateToken();
}