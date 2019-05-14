var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var httpClientLib = require('/lib/http-client');
var tokenLib = require('/lib/token');
var renderLib = require('/lib/render/render');
var contextLib = require('/lib/context');
var mailLib = require('/lib/mail');
var userLib = require('/lib/user');
var configLib = require('/lib/config');

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

    var body = renderLib.generateLoginPage(generateRedirectUrl(), "Successfully logged out");
    return {
        contentType: 'text/html',
        body: body
    };
};

exports.get = function (req) {
    var body;

    var action = req.params.action;
    if (action == 'forgot') {
        body = renderLib.generateForgotPasswordPage();
    }
    else if (action == 'sent') {
        body =
            renderLib.generateLoginPage(generateRedirectUrl(), "We have sent an email with instructions on how to reset your password");
    } else if (action == 'reset' && req.params.token) {
        if (tokenLib.isTokenValid(req.params.token)) {
            body = renderLib.generateUpdatePasswordPage(req.params.token);
        } else {
            body = renderLib.generateForgotPasswordPage(true);
        }
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

    var action = body.action;
    if (action == 'login' && body.user && body.password) {
        return handleLogin(req, body.user, body.password);
    } else if (action == 'send' && body.email) {
        return handleForgotPassword(req, body);
    } else if (action == 'update' && body.token && body.password) {
        return handleUpdatePwd(req, body.token, body.password);
    }

    return {
        status: 400,
        contentType: 'application/json'
    };
};

function generateRedirectUrl() {
    var site = contextLib.runAsAdmin(function () {
        return portalLib.getSite();
    }); 
    if (site) {
        return portalLib.pageUrl({id: site._id});
    }
    return '/';
}

function handleLogin(req, user, password) {
    var sessionTimeout = configLib.getSessionTimeout();
    var loginResult = authLib.login({
        user: user,
        password: password,
        userStore: portalLib.getUserStoreKey(),
        sessionTimeout: sessionTimeout == null ? null : sessionTimeout
    });
    return {
        body: loginResult,
        contentType: 'application/json'
    };
}

function handleForgotPassword(req, params) {

    var reCaptcha = configLib.getRecaptcha();
    if (reCaptcha) {
        var reCaptchaVerificationResponse = httpClientLib.request({
            url: 'https://www.google.com/recaptcha/api/siteverify',
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            multipart: [
                {
                    name: 'secret',
                    value: reCaptcha.secretKey
                },
                {
                    name: 'response',
                    value: params.reCaptcha
                }
            ]
        });

        var reCaptchaVerification = JSON.parse(reCaptchaVerificationResponse.body);
        if (!reCaptchaVerification || !reCaptchaVerification.success) {
            return {
                status: 400,
                contentType: 'application/json'
            }
        }
    }

    var user = userLib.findUserByEmail(params.email);

    //If a user has the email provided
    if (user) {
        //Generates a token
        var token = tokenLib.generateToken(user.key);

        mailLib.sendResetMail(req, params.email, token)

    } else {
        mailLib.sendIncorrectResetMail(req, params.email)
    }


    return {
        body: {},
        contentType: 'application/json'
    };
}

function handleUpdatePwd(req, token, password) {
    if (tokenLib.isTokenValid(token)) {
        contextLib.runAsAdmin(function () {
            var user = tokenLib.findUserByToken(token);

            authLib.changePassword({
                userKey: user.key,
                password: password
            });

            authLib.login({
                user: user.login,
                password: password,
                userStore: portalLib.getUserStoreKey()
            });

            mailLib.sendUpdatedPasswordMail(req, user.email);

            tokenLib.removeToken(user.key);
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

