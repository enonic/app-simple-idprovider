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

exports.get = function (req) {
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

function generateLoginPage(redirectionUrl) {
    var userStoreKey = authLib.getUserStore().key;
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";
    var theme = idProviderConfig.theme || "light";
    var color = idProviderConfig.color || "blue";


    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var loginScriptUrl = portalLib.assetUrl({path: "js/login.js"});
    var loginStyleUrl = portalLib.assetUrl({path: "css/login.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});
    var loginServiceUrl = portalLib.serviceUrl({service: "login"});

    var loginConfigView = resolve('login-config.txt');
    var loginConfig = mustacheLib.render(loginConfigView, {
        userStoreKey: userStoreKey,
        loginServiceUrl: loginServiceUrl,
        redirectionUrl: redirectionUrl
    });

    var themeView = resolve(theme + '-theme.html');
    var themeStyle = mustacheLib.render(themeView, {});
    var colorView = resolve(color + '-theme.html');
    var colorStyle = mustacheLib.render(colorView, {});

    var view = resolve("login.html");
    return mustacheLib.render(view, {
        title: title,
        loginConfig: loginConfig,
        themeStyle: themeStyle,
        colorStyle: colorStyle,
        jQueryUrl: jQueryUrl,
        loginScriptUrl: loginScriptUrl,
        loginStyleUrl: loginStyleUrl,
        userImgUrl: userImgUrl
    });
}

function generateLogoutPage(user, redirectionUrl) {
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";
    var theme = idProviderConfig.theme || "light";
    var color = idProviderConfig.color || "blue";

    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var loginScriptUrl = portalLib.assetUrl({path: "js/login.js"});
    var loginStyleUrl = portalLib.assetUrl({path: "css/login.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});
    var logoutUrl = portalLib.logoutUrl({});

    var themeView = resolve(theme + '-theme.html');
    var themeStyle = mustacheLib.render(themeView, {});
    var colorView = resolve(color + '-theme.html');
    var colorStyle = mustacheLib.render(colorView, {});

    var view = resolve("logout.html");
    return mustacheLib.render(view, {
        title: title,
        themeStyle: themeStyle,
        colorStyle: colorStyle,
        userName: user.displayName,
        logoutUrl: logoutUrl,
        redirectionUrl: redirectionUrl,
        jQueryUrl: jQueryUrl,
        loginScriptUrl: loginScriptUrl,
        loginStyleUrl: loginStyleUrl,
        userImgUrl: userImgUrl
    });
}
