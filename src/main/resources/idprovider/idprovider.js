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

    if (req.params.reset && req.params.user) {
        var token = req.params.reset;
        var userName = req.params.user;
        var userKey = "user:" + portalLib.getUserStoreKey() + ":" + userName;
        if (isTokenValid(userKey, token)) {
            body = renderLib.generateUpdatePasswordPage(token, userName);
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
    } else if (body.token && body.password && body.user) {
        return handleUpdatePwd(req, body.token, toUserKey(body.user), body.password);
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
    var mailBody;

    //If a user has the email provided
    if (user && user.email) {

        //Generates a token
        var token = runAsAdmin(function () {
            return tokenLib.generateToken(user.key)
        });

        //Prepares the reset email
        var passwordResetUrl = portalLib.idProviderUrl({
            params: {
                reset: token,
                user: user.login
            },
            type: 'absolute'
        });
        mailBody =
            '<p>To reset your password on <a href="' + req.scheme + '://' + req.host + ':' + req.port + '">' + req.host +
            '</a>, please click on the following link:</p>' +
            '<a href="' + passwordResetUrl + '">' + passwordResetUrl + '</a>' +
            "<p>If you don't want to reset your password or if you didn't request this, you can safely ignore this email.</p>.";
    } else {

        //Else, prepares a warning email
        mailBody =
            '<p>Somebody asked to reset your password on <a href="' + req.scheme + '://' + req.host + ":" + req.port + '">' + req.host +
            '</a>, but there is no user linked to this email address. </p>' +
            "<p>If you don't want to reset your password or if you didn't request this, you can safely ignore this email.</p>";
    }

    //Sends email
    sendMail(req, email, 'Password reset', mailBody);


    return {
        body: {},
        contentType: 'application/json'
    };
}

function handleUpdatePwd(req, token, userKey, password) {
    if (isTokenValid(userKey, token)) {
        runAsAdmin(function () {
            var userInfo = tokenLib.getUserInfo(token);

            authLib.changePassword({
                userKey: userInfo.key,
                password: password
            });

            authLib.login({
                user: userInfo.email,
                password: password,
                userStore: portalLib.getUserStoreKey()
            });

            sendMail(req, userInfo.email, 'Password updated',
                '<p>You have successfully changed your password on <a href="' + req.scheme + '://' + req.host + ":" + req.port + '">' +
                req.host + '</a>.</p>');

        });

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

function toUserKey(userName) {
    return "user:" + portalLib.getUserStoreKey() + ":" + userName;
}

function isTokenValid(userKey, token) {
    return runAsAdmin(function () {
        return tokenLib.isTokenValid(userKey, token);
    });
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
    //TODO There is no efficient way to find a user by email
    return runAsAdmin(function () {
        var users = authLib.findPrincipals({
            type: 'user',
            userStore: portalLib.getUserStoreKey(),
            start: 0,
            count: -1
        }).hits;

        return users.filter(function (user) {
            if (user.email == email) {
                log.info("match");
                return user;
            }
        })[0];
    });
}

function runAsAdmin(callback) {
    return contextLib.run({
        user: {
            login: 'su',   //TODO Change.
            userStore: 'system'
        }
    }, callback);
}

