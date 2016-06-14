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
        body = generateLoginPage();
    }

    return {
        contentType: 'text/html',
        body: body
    };
};

exports.logout = function (req) {
    authLib.logout();

    var redirectUrl = generateRedirectUrl();
    return {
        redirect: redirectUrl
    }
};

function generateRedirectUrl() {
    var site = portalLib.getSite();
    if (site) {
        return portalLib.pageUrl({id: site._id});
    }
    return '/';
}

function generateLoginPage() {
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
        loginServiceUrl: loginServiceUrl
    });

    var themeStyle = generateThemeStyle(theme);
    var colorStyle = generateColorStyle(color);

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

function generateLogoutPage(user) {
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "User Login";
    var theme = idProviderConfig.theme || "light";
    var color = idProviderConfig.color || "blue";

    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var logoutScriptUrl = portalLib.assetUrl({path: "js/logout.js"});
    var loginStyleUrl = portalLib.assetUrl({path: "css/login.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});

    var logoutServiceUrl = portalLib.serviceUrl({service: "logout"});
    var logoutConfigView = resolve('logout-config.txt');
    var logoutConfig = mustacheLib.render(logoutConfigView, {
        logoutServiceUrl: logoutServiceUrl
    });

    var themeStyle = generateThemeStyle(theme);
    var colorStyle = generateColorStyle(color);

    var view = resolve("logout.html");
    return mustacheLib.render(view, {
        title: title,
        logoutConfig: logoutConfig,
        themeStyle: themeStyle,
        colorStyle: colorStyle,
        userName: user.displayName,
        jQueryUrl: jQueryUrl,
        logoutScriptUrl: logoutScriptUrl,
        loginStyleUrl: loginStyleUrl,
        userImgUrl: userImgUrl
    });
}

function generateThemeStyle(theme) {
    var themeView = resolve(theme + '-theme.html');
    return mustacheLib.render(themeView, {});
}

function generateColorStyle(color) {
    var view = resolve('color-style.txt');
    return mustacheLib.render(view, generateColorValues(color));
}

function generateColorValues(color) {

    switch (color) {
    case "amber":
        return {color500: "#FFC107", color700: "#FFA000"};
    case "blue-grey":
        return {color500: "#607D8B", color700: "#455A64"};
    case "brown":
        return {color500: "#795548", color700: "#5D4037"};
    case "cyan":
        return {color500: "#00BCD4", color700: "#0097A7"};
    case "blue-grey":
        return {color500: "#607D8B", color700: "#455A64"};
    case "deep-orange":
        return {color500: "#FF5722", color700: "#E64A19"};
    case "deep-purple":
        return {color500: "#673AB7", color700: "#512DA8"};
    case "green":
        return {color500: "#4CAF50", color700: "#388E3C"};
    case "grey":
        return {color500: "#9E9E9E", color700: "#616161"};
    case "indigo":
        return {color500: "#3F51B5", color700: "#303F9F"};
    case "light-blue":
        return {color500: "#03A9F4", color700: "#0288D1"};
    case "light-green":
        return {color500: "#8BC34A", color700: "#689F38"};
    case "lime":
        return {color500: "#CDDC39", color700: "#AFB42B"};
    case "orange":
        return {color500: "#FF9800", color700: "#F57C00"};
    case "pink":
        return {color500: "#E91E63", color700: "#C2185B"};
    case "purple":
        return {color500: "#9C27B0", color700: "#7B1FA2"};
    case "red":
        return {color500: "#F44336", color700: "#D32F2F"};
    case "teal":
        return {color500: "#009688", color700: "#00796B"};
    case "teal":
        return {color500: "#FFEB3B", color700: "#FBC02D"};
    case "blue":
    default:
        return {color500: "#2196F3", color700: "#1976D2"};

    }
}
