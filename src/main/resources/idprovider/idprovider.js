var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var authLib = require('/lib/xp/auth');

exports.handle403 = function (req) {
    var body = generateLoginPage();

    return {
        status: 403,
        contentType: 'text/html',
        body: body
    };
};

exports.login = function (req) {
    var body;

    var user = authLib.getUser();
    if (user) {
        body = generateLogoutPage(user, req.params.redirect);
    } else {
        body = generateLoginPage(req.params.redirect);
    }

    return {
        contentType: 'text/html',
        body: body
    };
};

exports.logout = function (req) {
    authLib.logout();

    return {
        redirect: req.params.redirect
    }
};

function generateLoginPage(redirectUrl) {
    var userStoreKey = authLib.getUserStore().key;
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";
    var theme = idProviderConfig.theme || "blue";


    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var loginScriptUrl = portalLib.assetUrl({path: "js/login.js"});
    var loginStyleUrl = portalLib.assetUrl({path: "css/login.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});
    var loginServiceUrl = portalLib.serviceUrl({service: "login"});

    var loginConfigView = resolve('login-config.txt');
    var loginConfig = mustacheLib.render(loginConfigView, {
        userStoreKey: userStoreKey,
        loginServiceUrl: loginServiceUrl,
        redirectUrl: redirectUrl
    });

    var themeView = resolve(theme + '-theme.html');
    var theme = mustacheLib.render(themeView, {});

    var view = resolve("login.html");
    return mustacheLib.render(view, {
        title: title,
        loginConfig: loginConfig,
        theme: theme,
        jQueryUrl: jQueryUrl,
        loginScriptUrl: loginScriptUrl,
        loginStyleUrl: loginStyleUrl,
        userImgUrl: userImgUrl
    });
}

function generateLogoutPage(user, redirectUrl) {
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";
    var theme = idProviderConfig.theme || "blue";

    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var loginScriptUrl = portalLib.assetUrl({path: "js/login.js"});
    var loginStyleUrl = portalLib.assetUrl({path: "css/login.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});
    var logoutUrl = portalLib.logoutUrl({redirect: redirectUrl});

    var themeView = resolve(theme + '-theme.html');
    var theme = mustacheLib.render(themeView, {});

    var view = resolve("logout.html");
    return mustacheLib.render(view, {
        title: title,
        theme: theme,
        userName: user.displayName,
        logoutUrl: logoutUrl,
        jQueryUrl: jQueryUrl,
        loginScriptUrl: loginScriptUrl,
        loginStyleUrl: loginStyleUrl,
        userImgUrl: userImgUrl
    });
}
