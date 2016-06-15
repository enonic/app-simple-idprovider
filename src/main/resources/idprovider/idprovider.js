var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var authLib = require('/lib/xp/auth');

exports.handle401 = function (req) {
    var body = generateLoginPage();

    return {
        status: 401,
        contentType: 'text/html',
        body: body
    };
};

exports.get = function (req) {
    var body;

    var user = authLib.getUser();
    if (user) {
        body = generateLogoutPage(user);
    } else {
        body = generateLoginPage(req.params.loggedOut);
    }

    return {
        contentType: 'text/html',
        body: body
    };
};

exports.logout = function (req) {
    authLib.logout();

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            loggedOut: ""
        }
    });

    return {
        redirect: redirectUrl
    }
};

function generateLoginPage(loggedOut) {
    var userStoreKey = authLib.getUserStore().key;
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";
    var theme = idProviderConfig.theme || "light-blue";

    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var loginScriptUrl = portalLib.assetUrl({path: "js/login.js"});
    var loginStyleUrl = portalLib.assetUrl({path: "css/login.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});

    var redirectUrl = generateRedirectUrl();

    var loginServiceUrl = portalLib.serviceUrl({service: "login"});
    var loginConfigView = resolve('login-config.txt');
    var loginConfig = mustacheLib.render(loginConfigView, {
        redirectUrl: redirectUrl,
        userStoreKey: userStoreKey,
        loginServiceUrl: loginServiceUrl
    });

    var backgroundStyleUrl = generateBackgroundStyleUrl(theme);
    var colorStyleUrl = generateColorStyleUrl(theme);

    log.info("loggedOut" + loggedOut);

    var view = resolve("login.html");
    return mustacheLib.render(view, {
        title: title,
        loginConfig: loginConfig,
        backgroundStyleUrl: backgroundStyleUrl,
        colorStyleUrl: colorStyleUrl,
        jQueryUrl: jQueryUrl,
        loginScriptUrl: loginScriptUrl,
        loginStyleUrl: loginStyleUrl,
        userImgUrl: userImgUrl,
        redirectUrl: redirectUrl,
        loggedOut: loggedOut
    });
}

function generateRedirectUrl() {
    var site = portalLib.getSite();
    if (site) {
        return portalLib.pageUrl({id: site._id});
    }
    return '/';
}

function generateLogoutPage(user) {
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";
    var theme = idProviderConfig.theme || "light-blue";

    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var logoutScriptUrl = portalLib.assetUrl({path: "js/logout.js"});
    var loginStyleUrl = portalLib.assetUrl({path: "css/login.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            loggedOut: ""
        }
    });

    var logoutServiceUrl = portalLib.serviceUrl({service: "logout"});
    var logoutConfigView = resolve('logout-config.txt');
    var logoutConfig = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl,
        logoutServiceUrl: logoutServiceUrl
    });


    var backgroundStyleUrl = generateBackgroundStyleUrl(theme);
    var colorStyleUrl = generateColorStyleUrl(theme);

    var view = resolve("logout.html");
    return mustacheLib.render(view, {
        title: title,
        logoutConfig: logoutConfig,
        backgroundStyleUrl: backgroundStyleUrl,
        colorStyleUrl: colorStyleUrl,
        userName: user.displayName,
        jQueryUrl: jQueryUrl,
        logoutScriptUrl: logoutScriptUrl,
        loginStyleUrl: loginStyleUrl,
        userImgUrl: userImgUrl
    });
}

function generateBackgroundStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 1)[0] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}

function generateColorStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 2)[1] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}

