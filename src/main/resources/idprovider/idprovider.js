var authLib = require('/lib/xp/auth');
var contextLib = require('/lib/xp/context');
var mailLib = require('/lib/xp/mail');
var portalLib = require('/lib/xp/portal');
var tokenLib = require('/lib/token');
var renderLib = require('/lib/render/render');

exports.handle401 = function (req) {
    var body = renderLib.generateLoginPage();

    return {
        status: 401,
        contentType: 'text/html',
        body: body
    };
};

exports.login = function (req) {
    var redirectUrl = req.validTicket ? req.params.redirect : generateRedirectUrl();
    var body = renderLib.generateLoginPage(redirectUrl);
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

    var body = renderLib.generateLoggedOutPage();
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
            body = renderLib.generateUpdatePasswordPage(token);
        } else {
            body = renderLib.generateExpiredTokenPage();
        }
    } else if (req.params.sentEmail) {
        body = renderLib.generateSentMailPage();
    } else if (req.params.forgot) {
        body = renderLib.generateForgotPasswordPage();
    } else {
        var user = authLib.getUser();
        if (user) {
            body = renderLib.generateLogoutPage(user);
        } else {
            body = renderLib.generateLoginPage(generateRedirectUrl());
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

function generateRedirectUrl() {
    var site = portalLib.getSite();
    if (site) {
        return portalLib.pageUrl({id: site._id});
    }
    return '/';
}

function handleForgotPassword(req, email) {
    var user = findUserByEmail(email);

    var toEmailAddress;
    var body;

    //If a user has the email provider
    if (user && user.email) {

        //Generates a token
        var token = tokenLib.generateToken();

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
    if (tokenLib.isTokenValid(token)) {
        var userInfo = tokenLib.getUserInfo(token);
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

