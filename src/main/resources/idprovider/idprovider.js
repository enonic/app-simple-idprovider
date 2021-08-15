const authLib = require('/lib/xp/auth');
const portalLib = require('/lib/xp/portal');
const httpClientLib = require('/lib/http-client');
const tokenLib = require('/lib/resetToken');
const twoStepLib = require('/lib/twoStepToken');
const renderLib = require('/lib/render/render');
const contextLib = require('/lib/context');
const mailLib = require('/lib/mail');
const userLib = require('/lib/user');
const configLib = require('/lib/config');

function getLoginPage(redirectUrl, info) {
    let codeRedirect;
    if (isEmailCodeRequired()) {
        codeRedirect = generateCodeRedirectpage();
    } else {
        codeRedirect = generateRedirectUrl();
    }
    return renderLib.generateLoginPage(redirectUrl, info, codeRedirect);
}

function generateRedirectUrl() {
    const site = contextLib.runAsAdmin(function () {
        return portalLib.getSite();
    });
    if (site) {
        return portalLib.pageUrl({ id: site._id });
    }
    return '/';
}

function generateCodeRedirectpage() {
    return contextLib.runAsAdmin(function () {
        return portalLib.idProviderUrl({
            params: {
                action: 'code',
            },
        });
    });
}

function isEmailCodeRequired() {
    const idProviderConfig = configLib.getConfig();

    if (idProviderConfig.twoFactorEmail === undefined) {
        return false;
    } else {
        return true;
    }
}

function handleLogin(req, user, password) {
    const sessionTimeout = configLib.getSessionTimeout();
    let loginResult = {};

    if (isEmailCodeRequired()) {
        const validUser = twoStepLib.checkLogin({
            user,
            password,
        });

        if (validUser) {
            const userNode = twoStepLib.getUser(user);
            const tokens = twoStepLib.generateTokens(user);
            loginResult.twoStep = true;
            loginResult.authenticated = true;

            try {
                mailLib.sendLoginCodeEmail(
                    req,
                    userNode.email,
                    tokens.emailCode
                );
            } catch (e) {
                //Locally email fails. Change configuration or setup an email server
                log.error(`Could not send email:`);
                log.error(JSON.stringify(e.message, null, 4));
                log.error(JSON.stringify(e.stacktrace, null, 4));
            }

            loginResult.userToken = tokens.userToken;
        }
    } else {
        loginResult = authLib.login({
            user: user,
            password: password,
            idProvider: portalLib.getIdProviderKey(),
            sessionTimeout: sessionTimeout == null ? null : sessionTimeout,
            scope: 'SESSION',
        });
    }
    return {
        body: loginResult,
        contentType: 'application/json',
    };
}

function handleCodeLogin(req, user, userToken, code) {
    const valid = twoStepLib.isTokenValid(user, userToken, code);

    if (valid) {
        const sessionTimeout = configLib.getSessionTimeout();
        const loginResult = authLib.login({
            user: user,
            idProvider: portalLib.getIdProviderKey(),
            sessionTimeout: sessionTimeout == null ? null : sessionTimeout,
            skipAuth: true,
            scope: 'SESSION',
        });
        return {
            body: loginResult,
            contentType: 'application/json',
        };
    } else {
        return {
            status: 403,
            body: {
                authenticated: false,
            },
            contentType: 'application/json',
        };
    }
}

function handleForgotPassword(req, params) {
    const reCaptcha = configLib.getRecaptcha();
    if (reCaptcha) {
        const reCaptchaVerificationResponse = httpClientLib.request({
            url: 'https://www.google.com/recaptcha/api/siteverify',
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            multipart: [
                {
                    name: 'secret',
                    value: reCaptcha.secretKey,
                },
                {
                    name: 'response',
                    value: params.reCaptcha,
                },
            ],
        });

        const reCaptchaVerification = JSON.parse(
            reCaptchaVerificationResponse.body
        );
        if (!reCaptchaVerification || !reCaptchaVerification.success) {
            return {
                status: 400,
                contentType: 'application/json',
            };
        }
    }

    const user = userLib.findUserByEmail(params.email);

    //If a user has the email provided
    if (user) {
        //Generates a token
        const token = tokenLib.generateToken(user.key);

        mailLib.sendResetMail(req, params.email, token);
    } else {
        mailLib.sendIncorrectResetMail(req, params.email);
    }

    return {
        body: {},
        contentType: 'application/json',
    };
}

function handleUpdatePwd(req, token, password) {
    if (tokenLib.isTokenValid(token)) {
        contextLib.runAsAdmin(function () {
            const user = tokenLib.findUserByToken(token);

            authLib.changePassword({
                userKey: user.key,
                password: password,
            });

            authLib.login({
                user: user.login,
                password: password,
                idProvider: portalLib.getIdProviderKey(),
            });

            mailLib.sendUpdatedPasswordMail(req, user.email);

            tokenLib.removeToken(user.key);
        });

        return {
            body: { updated: true },
            contentType: 'application/json',
        };
    }

    return {
        body: { updated: false },
        contentType: 'application/json',
    };
}

exports.handle401 = function (req) {
    const body = getLoginPage();

    return {
        status: 401,
        contentType: 'text/html',
        body: body,
    };
};

exports.login = function (req) {
    const redirectUrl = req.validTicket
        ? req.params.redirect
        : generateRedirectUrl();
    const body = getLoginPage(redirectUrl);
    return {
        contentType: 'text/html',
        body: body,
    };
};

exports.logout = function (req) {
    authLib.logout();

    if (req.validTicket && req.params.redirect) {
        return {
            redirect: req.params.redirect,
        };
    }

    const body = getLoginPage(generateRedirectUrl(), 'Successfully logged out');
    return {
        contentType: 'text/html',
        body: body,
    };
};

exports.get = function (req) {
    let body;

    const action = req.params.action;
    const token = req.params.token;
    const user = authLib.getUser();
    switch (action) {
        case 'forgot':
            body = renderLib.generateForgotPasswordPage();
            break;
        case 'sent':
            body = renderLib.generateLoginPage(
                generateRedirectUrl(),
                'We have sent an email with instructions on how to reset your password'
            );
            break;
        case 'reset':
            if (tokenLib.isTokenValid(token)) {
                body = renderLib.generateUpdatePasswordPage(token);
            } else {
                body = renderLib.generateForgotPasswordPage(true);
            }
            break;
        case 'code':
            body = renderLib.generateCodePage(
                generateRedirectUrl(),
                'Email code'
            );
            break;
        default:
            if (user) {
                body = renderLib.generateLogoutPage(user);
            } else {
                body = getLoginPage(generateRedirectUrl());
            }
            break;
    }

    return {
        contentType: 'text/html',
        body: body,
    };
};

exports.post = function (req) {
    const body = JSON.parse(req.body);

    const action = body.action;
    switch (action) {
        case 'login':
            if (body.user && body.password) {
                return handleLogin(req, body.user, body.password);
            }
            break;
        case 'send':
            if (body.email) {
                return handleForgotPassword(req, body);
            }
            break;
        case 'update':
            if (body.token && body.password) {
                return handleUpdatePwd(req, body.token, body.password);
            }
            break;
        case 'code':
            if (body.user && body.userToken && body.code) {
                return handleCodeLogin(
                    req,
                    body.user,
                    body.userToken,
                    body.code
                );
            }
    }

    return {
        status: 400,
        contentType: 'application/json',
    };
};
