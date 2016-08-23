var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var displayLib = require('/lib/display');


exports.generateLoginPage = function (redirectUrl, info) {
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
        config: config,
        info: info,
        body: {
            username: "Username or email",
            password: "Password",
            forgotPasswordUrl: forgotPasswordUrl
        }
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
        title: user.displayName,
        submit: "LOG OUT"
    });
};

exports.generateForgotPasswordPage = function (expired) {
    var scriptUrl = portalLib.assetUrl({path: "js/forgot-pwd.js"});

    var redirectUrl = portalLib.idProviderUrl({params: {action: 'sent'}});
    var sendTokenUrl = portalLib.idProviderUrl();
    var logoutConfigView = resolve('forgot-pwd-config.txt');
    var config = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl,
        sendTokenUrl: sendTokenUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        title: "Password reset",
        error: expired ? "Sorry, but this link has expired. You can request another one below." : undefined,
        body: {
            username: "Email"
        },
        submit: "RESET"
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
        title: "Update password",
        body: {
            username: "New Password"
        }
    });
};

function generatePage(params) {
    var idProviderConfig = authLib.getIdProviderConfig();
    params.title = params.title || idProviderConfig.title || "User Login";
    params.theme = idProviderConfig.theme || "light-blue";
    return displayLib.render(params);
}

function generateBackgroundStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 1)[0] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}

function generateColorStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 2)[1] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}