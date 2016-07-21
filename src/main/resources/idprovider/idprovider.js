var authLib = require('/lib/xp/auth');
var contextLib = require('/lib/xp/context');
var mailLib = require('/lib/xp/mail');
var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var tokenLib = require('/lib/token');

var tokenByUser = {};
var infoByToken = {};

exports.handle401 = function (req) {
    var body = generateLoginPage();

    return {
        status: 401,
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

exports.get = function (req) {
    var body;

    if (req.params.reset) {
        var token = req.params.reset;
        if (isTokenValid(token)) {
            body = generateUpdatePasswordPage(token);
        } else {
            body = generateExpiredTokenPage();
        }
    } else if (req.params.sentEmail) {
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

exports.post = function (req) {
    var body = JSON.parse(req.body);

    if (body.email) {
        return handleForgotPassword(req, body.email);
    } else if (body.token && body.password) {
        return handleUpdatePwd(req, body.token, body.password);
    }

    return {
        status: 400,
        contentType: 'application/json'
    };
};

function isTokenValid(token) {
    var userInfo = infoByToken[token];
    return userInfo && (userInfo.timestamp - Date.now()) < 86400000
}

function handleForgotPassword(req, email) {
    var user = findUserByEmail(email);

    var toEmailAddress;
    var body;

    //If a user has the email provider
    if (user && user.email) {

        //Deletes existing token
        var existingToken = tokenByUser[user.email];
        if (existingToken) {
            delete infoByToken[existingToken];
        }

        //Generates new token
        var token = tokenLib.generateToken();
        tokenByUser[user.email] = token;
        infoByToken[token] = {
            key: user.key,
            email: user.email,
            timestamp: Date.now()
        };

        //Prepares the reset email
        var passwordResetUrl = portalLib.idProviderUrl({params: {reset: token}, type: 'absolute'});
        body = '<p>Somebody asked to reset your password on <a href="' + req.scheme + '://' + req.host + ':' + req.port + '">' + req.host +
               '</a>.<br/>' +
               'If it was not you, you can safely ignore this email.</p>' +
               '<p>To reset your password, click on the following link:</p>' +
               '<a href="' + passwordResetUrl + '">' + passwordResetUrl + '</a>';
    } else {

        //Else, prepares a warning email
        body = '<p>Somebody asked to reset your password on <a href="' + req.scheme + '://' + req.host + ":" + req.port + '">' + req.host +
               '</a>.<br/>' +
               'If it was not you, you can safely ignore this email.</p>' +
               '<p>There is no user linked to this email address.<br/>' +
               'You might have signed up with a different address</p>';
    }

    //Sends email
    sendMail(req, email, 'Password reset', body);


    return {
        body: {},
        contentType: 'application/json'
    };
}

function handleUpdatePwd(req, token, password) {
    if (isTokenValid(token)) {
        var userInfo = infoByToken[token];
        runAdAdmin(function () {
            authLib.changePassword({
                userKey: userInfo.key,
                password: password
            });

            authLib.login({
                user: userInfo.email,
                password: password,
                userStore: portalLib.getUserStoreKey()
            });
        });

        sendMail(req, userInfo.email, 'Password updated',
            '<p>You have successfully changed your password on <a href="' + req.scheme + '://' + req.host + ":" + req.port + '">' +
            req.host + '</a>.</p>');

        return {
            body: {updated: true},
            contentType: 'application/json'
        };
    }

    return {
        body: {updated: false},
        contentType: 'application/json'
    };
}

function sendMail(req, to, subject, body) {
    var from = authLib.getIdProviderConfig().email || ('noreply@' + req.host);
    mailLib.send({
        from: from,
        to: to,
        subject: subject,
        body: body,
        contentType: 'text/html; charset="UTF-8"'
    });
}

function findUserByEmail(email) {
    return runAdAdmin(function () {
        var users = authLib.findPrincipals({
            type: 'user',
            userStore: portalLib.getUserStoreKey(),
            start: 0,
            count: 1
        }).hits;

        return users.filter(function (user) {
            if (user.email == email) {
                log.info("match");
                return user;
            }
        })[0];
    });
}

function runAdAdmin(callback) {
    return contextLib.run({
        user: {
            login: 'su',   //TODO Change.
            userStore: 'system'
        }
    }, callback);
}

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
    var scriptUrl = portalLib.assetUrl({path: "js/forgot-pwd.js"});

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            sentEmail: true
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
}

function generateSentMailPage() {
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
}

function generateExpiredTokenPage() {
    var scriptUrl = portalLib.assetUrl({path: "js/redirect.js"});

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            forgot: true
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
}

function generateUpdatePasswordPage(token) {
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

