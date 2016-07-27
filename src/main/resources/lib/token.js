var tokenByUser = {};
var infoByToken = {};

exports.isTokenValid = function (token) {
    var userInfo = infoByToken[token];
    return userInfo && (userInfo.timestamp - Date.now()) < 86400000
};

exports.getUserInfo = function (token) {
    return infoByToken[token];
}

exports.generateToken = function () {
    //Deletes existing token
    var existingToken = tokenByUser[user.email];
    if (existingToken) {
        delete infoByToken[existingToken];
    }

    //Generates new token
    var token = tokenLib.generateToken();
    tokenByUser[user.email] = token;
    infoByToken[token] = {
        key: user.key,
        email: user.email,
        timestamp: Date.now()
    };

    return token;
};


function doGenerateToken() {
    var bean = __.newBean('com.enonic.app.simpleidprovider.TokenGeneratorService');
    return bean.generateToken();
};