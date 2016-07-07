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

    if (req.params.sentEmail) {
        body = generateSentMailPage();
    } else if (req.params.forgot) {
        body = generateForgotPasswordPage();
    } else {
        var user = authLib.getUser();
        if (user) {
            body = generateLogoutPage(user);
        } else {
            body = generateLoginPage(generateRedirectUrl());
        }
    }

    return {
        contentType: 'text/html',
        body: body
    };
};

exports.login = function (req) {
    var redirectUrl = req.validTicket ? req.params.redirect : generateRedirectUrl();
    var body = generateLoginPage(redirectUrl);
    return {
        contentType: 'text/html',
        body: body
    };
};

exports.logout = function (req) {
    authLib.logout();

    if (req.validTicket && req.params.redirect) {
        return {
            redirect: req.params.redirect
        };
    }

    var body = generateLoggedOutPage();
    return {
        contentType: 'text/html',
        body: body
    };
};

function generateLoginPage(redirectUrl) {
    var scriptUrl = portalLib.assetUrl({path: "js/login.js"});

    var userStoreKey = portalLib.getUserStoreKey();
    var loginServiceUrl = portalLib.serviceUrl({service: "login"});
    var forgotPasswordUrl = portalLib.idProviderUrl({
        params: {
            forgot: true
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
}

function generateLogoutPage(user) {
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
}

function generateLoggedOutPage() {
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
}

function generateForgotPasswordPage() {
    var scriptUrl = portalLib.assetUrl({path: "js/redirect.js"});

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            sentEmail: true
        }
    });
    var logoutConfigView = resolve('redirect-config.txt');
    var config = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        forgotPwd: true
    });
}

function generateSentMailPage() {
    var scriptUrl = portalLib.assetUrl({path: "js/redirect.js"});

    var redirectUrl = portalLib.loginUrl();
    var logoutConfigView = resolve('redirect-config.txt');
    var config = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        sentMail: true
    });
}


function generateRedirectUrl() {
    var site = portalLib.getSite();
    if (site) {
        return portalLib.pageUrl({id: site._id});
    }
    return '/';
}

function generatePage(params) {
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";

    var theme = idProviderConfig.theme || "light-blue";
    var backgroundStyleUrl = generateBackgroundStyleUrl(theme);
    var colorStyleUrl = generateColorStyleUrl(theme);

    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var styleUrl = portalLib.assetUrl({path: "css/style.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            loggedOut: ""
        }
    });

    var view = resolve("idprovider.html");
    params.title = title;
    params.styleUrl = styleUrl;
    params.backgroundStyleUrl = backgroundStyleUrl;
    params.colorStyleUrl = colorStyleUrl;
    params.jQueryUrl = jQueryUrl;
    params.userImgUrl = userImgUrl;

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

