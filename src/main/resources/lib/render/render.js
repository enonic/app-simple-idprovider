var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');

exports.generateLoginPage = function (redirectUrl) {
    var scriptUrl = portalLib.assetUrl({path: "js/login.js"});

    var userStoreKey = portalLib.getUserStoreKey();
    var loginServiceUrl = portalLib.serviceUrl({service: "login"});
    var forgotPasswordUrl = portalLib.idProviderUrl({
        params: {
            action: 'forgot'
        }
    });

    var loginConfigView = resolve('login-config.txt');
    var config = mustacheLib.render(loginConfigView, {
        redirectUrl: redirectUrl,
        userStoreKey: userStoreKey,
        loginServiceUrl: loginServiceUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        forgotPasswordUrl: forgotPasswordUrl,
        config: config,
        login: true
    });
};

exports.generateLogoutPage = function (user) {
    var scriptUrl = portalLib.assetUrl({path: "js/redirect.js"});

    var redirectUrl = portalLib.logoutUrl();
    var logoutConfigView = resolve('redirect-config.txt');
    var config = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        userName: user.displayName,
        logout: true
    });
};

exports.generateLoggedOutPage = function () {
    var scriptUrl = portalLib.assetUrl({path: "js/redirect.js"});

    var redirectUrl = portalLib.loginUrl();
    var logoutConfigView = resolve('redirect-config.txt');
    var config = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        loggedOut: true
    });
};

exports.generateForgotPasswordPage = function () {
    var scriptUrl = portalLib.assetUrl({path: "js/forgot-pwd.js"});

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            action: 'sent'
        }
    });
    var sendTokenUrl = portalLib.idProviderUrl();

    var logoutConfigView = resolve('forgot-pwd-config.txt');
    var config = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl,
        sendTokenUrl: sendTokenUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        forgotPwd: true
    });
};

exports.generateSentMailPage = function () {
    var scriptUrl = portalLib.assetUrl({path: "js/redirect.js"});

    var redirectUrl = portalLib.loginUrl();
    var redirectConfigView = resolve('redirect-config.txt');
    var config = mustacheLib.render(redirectConfigView, {
        redirectUrl: redirectUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        sentMail: true
    });
};

exports.generateExpiredTokenPage = function () {
    var scriptUrl = portalLib.assetUrl({path: "js/redirect.js"});

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            action: 'forgot'
        }
    });
    var redirectConfigView = resolve('redirect-config.txt');
    var config = mustacheLib.render(redirectConfigView, {
        redirectUrl: redirectUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        expiredToken: true
    });
};

exports.generateUpdatePasswordPage = function (token) {
    var scriptUrl = portalLib.assetUrl({path: "js/update-pwd.js"});

    var idProviderUrl = portalLib.idProviderUrl();

    var configView = resolve('update-pwd-config.txt');
    var config = mustacheLib.render(configView, {
        idProviderUrl: idProviderUrl,
        token: token
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        updatePwd: true
    });
};

function generatePage(params) {
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";

    var theme = idProviderConfig.theme || "light-blue";
    var backgroundStyleUrl = generateBackgroundStyleUrl(theme);
    var colorStyleUrl = generateColorStyleUrl(theme);

    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var styleUrl = portalLib.assetUrl({path: "css/style.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});
    var opensansRegularUrl = portalLib.assetUrl({path: "fonts/opensans-regular"});

    var view = resolve("page.html");
    params.title = title;
    params.styleUrl = styleUrl;
    params.backgroundStyleUrl = backgroundStyleUrl;
    params.colorStyleUrl = colorStyleUrl;
    params.jQueryUrl = jQueryUrl;
    params.userImgUrl = userImgUrl;
    params.opensansRegularUrl = opensansRegularUrl;


    return mustacheLib.render(view, params);
}

function generateBackgroundStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 1)[0] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}

function generateColorStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 2)[1] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}