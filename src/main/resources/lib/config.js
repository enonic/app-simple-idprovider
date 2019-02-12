var authLib = require('/lib/xp/auth');

function getConfig() {
    return authLib.getIdProviderConfig()
};
exports.getConfig = getConfig;

function getTitle() {
    return authLib.getIdProviderConfig().title;
};
exports.getTitle = getTitle;

function getTheme() {
    return authLib.getIdProviderConfig().theme;
};
exports.getTheme = getTheme;

function getGravatar() {
    return authLib.getIdProviderConfig().gravatar;
};
exports.getGravatar = getGravatar;

function getSessionTimeout() {
    return authLib.getIdProviderConfig().sessionTimeout;
};
exports.getSessionTimeout = getSessionTimeout;

function getForgotPassword() {
    var forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    if (forgotPassword && forgotPassword.site) {
        return forgotPassword;
    }
    return null;
};
exports.getForgotPassword = getForgotPassword;

function getEmail() {
    var forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    return forgotPassword && forgotPassword.email;
};
exports.getEmail = getEmail;

function getSite() {
    var forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    return forgotPassword && forgotPassword.site;
};
exports.getSite = getSite;

function getRecaptcha() {
    var forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    var reCaptcha = forgotPassword && forgotPassword.reCaptcha
    if (reCaptcha && reCaptcha.siteKey && reCaptcha.secretKey) {
        return reCaptcha;
    }
    return null;
};
exports.getRecaptcha = getRecaptcha;

function getSiteKey() {
    var forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    return forgotPassword.reCaptcha && forgotPassword.reCaptcha.siteKey;
};
exports.getSiteKey = getSiteKey;

function getSecretKey() {
    var forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    return forgotPassword.reCaptcha && forgotPassword.reCaptcha.secretKey;
};
exports.getSecretKey = getSecretKey;