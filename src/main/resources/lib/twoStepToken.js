const authLib = require("/lib/xp/auth");
const portalLib = require('/lib/xp/portal');
const contextLib = require("/lib/context");
const textEncoding = require("/lib/text-encoding");

/**
 * Checks for a valid emailCode
 * @param {String} user user login name or user email
 * @param {String} code code received on email
 * @returns 
 */
exports.isTokenValid = function (userId, userToken, code) {
    const user = getUser(userId);

    if (user) {
        const userLogin = user.profile.userLogin;
        
        if (
            userLogin.twoStepTimestamp - Date.now() < 600000 &&
            textEncoding.sha256(userToken + code + userLogin.salt) === userLogin.twoStepToken
        ) {
            removeToken(user.key);
            return true;
        }
    }
    return false;
};

function getUser(user) {
    const result = contextLib.runAsAdmin(function () {
        const checkUserStore = `userstorekey = '${portalLib.getIdProviderKey()}'`;
        return authLib.findUsers({
            count: 1,
            query: `${checkUserStore} AND login = '${user}'`
            + ` OR ${checkUserStore} AND email = '${user}'`,
            includeProfile: true,
        }).hits[0];
    });

    return result;
};

exports.getUser = getUser;

exports.generateTokens = function (userId) {
    const user = getUser(userId);
    const salt = doGenerateRandomString();   
    const userToken = doGenerateRandomString();
    const emailCode = doGenerateEmailCode();
    const encodedToken = textEncoding.sha256(userToken + emailCode + salt);

    contextLib.runAsAdmin(function () {
        authLib.modifyProfile({
            key: user.key,
            scope: "userLogin",
            editor: function (p) {
                if (!p) {
                    p ={};
                }
                p.salt = salt;
                p.twoStepToken = encodedToken;
                p.twoStepTimestamp = Date.now();
                return p;
            },
        });
    });

    return {
        userToken,
        emailCode,
    };
};

function removeToken(userKey) {
    contextLib.runAsAdmin(function () {
        authLib.modifyProfile({
            key: userKey,
            scope: "userLogin",
            editor: function (p) {
                p.salt = null;
                p.twoStepToken = null;
                p.twoStepTimestamp = null;
                return p;
            },
        });
    });
}
exports.removeToken = removeToken;

function doGenerateRandomString() {
    const bean = __.newBean(
        "com.enonic.app.simpleidprovider.TokenGeneratorService"
    );
    return bean.generateToken();
}

function doGenerateEmailCode() {
    const bean = __.newBean(
        "com.enonic.app.simpleidprovider.TokenGeneratorService"
    );
    return bean.generateCode();
}

// validated username and password. Does not do an login eg. session etc.
exports.checkLogin = function(param) {
    const bean = __.newBean("com.enonic.app.simpleidprovider.AuthenticateHandler");
    const idproviderkey = contextLib.runAsAdmin(function () {
        return portalLib.getIdProviderKey();
    });
    let email = getUser(param.user).email;
    bean.setUser(email);
    bean.setPassword(param.password);
    bean.setIdProvider([].concat(idproviderkey));

    return bean.attemptLogin();
}