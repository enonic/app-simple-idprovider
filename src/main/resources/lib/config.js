const authLib = require('/lib/xp/auth');

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
    const forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    if (forgotPassword && forgotPassword.site) {
        return forgotPassword;
    }
    return null;
};
exports.getForgotPassword = getForgotPassword;

function getEmail() {
    const forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    return forgotPassword && forgotPassword.email;
};
exports.getEmail = getEmail;

function getSite() {
    const forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    return forgotPassword && forgotPassword.site;
};
exports.getSite = getSite;

function getRecaptcha() {
    const forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    const reCaptcha = forgotPassword && forgotPassword.reCaptcha
    if (reCaptcha && reCaptcha.siteKey && reCaptcha.secretKey) {
        return reCaptcha;
    }
    return null;
};
exports.getRecaptcha = getRecaptcha;

function getSiteKey() {
    const forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    return forgotPassword.reCaptcha && forgotPassword.reCaptcha.siteKey;
};
exports.getSiteKey = getSiteKey;

function getSecretKey() {
    const forgotPassword = authLib.getIdProviderConfig().forgotPassword;
    return forgotPassword.reCaptcha && forgotPassword.reCaptcha.secretKey;
};
exports.getSecretKey = getSecretKey;