const portalLib = require('/lib/xp/portal');
const mustacheLib = require('/lib/mustache');
const displayLib = require('/lib/display');
const gravatarLib = require('/lib/gravatar');
const configLib = require('/lib/config');

exports.generateLoginPage = function (req, redirectUrl, info, codeUrl) {
    const scriptUrl = req.contextPath + '/_static/js/login.js';

    const idProviderKey = portalLib.getIdProviderKey();
    const loginServiceUrl = portalLib.idProviderUrl();
    const forgotPasswordUrl = configLib.getForgotPassword() ? portalLib.idProviderUrl({
        params: {
            action: 'forgot'
        }
    }) : undefined;

    const loginConfigView = resolve('login-config.txt');
    const config = mustacheLib.render(loginConfigView, {
        codeUrl,
        redirectUrl,
        idProviderKey,
        loginServiceUrl,
    });

    return generatePage(req, {
        scriptUrl: scriptUrl,
        config: config,
        info,
        body: {
            username: "Username or email",
            password: "Password",
            forgotPasswordUrl,
        }
    });
};

exports.generateLogoutPage = function (req, user) {
    const scriptUrl = req.contextPath + '/_static/js/redirect.js';

    const redirectUrl = portalLib.logoutUrl();
    const logoutConfigView = resolve('redirect-config.txt');
    const config = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl
    });

    let profileUrl;
    if (user.email && configLib.getGravatar()) {
        const gravatarHash = gravatarLib.hash(user.email);
        profileUrl = "https://www.gravatar.com/avatar/" + gravatarHash + "?d=blank";
    }

    return generatePage(req, {
        scriptUrl,
        config,
        title: user.displayName,
        profileUrl,
        submit: "LOG OUT"
    });
};

exports.generateForgotPasswordPage = function (req, expired) {
    const scriptUrl = req.contextPath + '/_static/js/forgot-pwd.js';

    const redirectUrl = portalLib.idProviderUrl({params: {action: 'sent'}});
    const sendTokenUrl = portalLib.idProviderUrl();
    const logoutConfigView = resolve('forgot-pwd-config.txt');
    const config = mustacheLib.render(logoutConfigView, {
        redirectUrl: redirectUrl,
        sendTokenUrl: sendTokenUrl
    });

    const siteKey = configLib.getSiteKey();

    return generatePage(req, {
        scriptUrl: scriptUrl,
        config: config,
        title: "Password reset",
        error: expired ? "Sorry, but this link has expired. You can request another one below." : undefined,
        body: {
            username: "Email",
            reCaptcha: siteKey
        },
        submit: "RESET"
    });
};

exports.generateUpdatePasswordPage = function (req, token) {
    const scriptUrl = req.contextPath + '/_static/js/update-pwd.js';

    const idProviderUrl = portalLib.idProviderUrl();

    const configView = resolve('update-pwd-config.txt');
    const config = mustacheLib.render(configView, {
        idProviderUrl: idProviderUrl,
        token: token
    });

    return generatePage(req, {
        scriptUrl: scriptUrl,
        config: config,
        title: "Update password",
        body: {
            password: "New Password",
            confirmation: "Confirm new password"
        },
        submit: "UPDATE"
    });
};

exports.generateCodePage = function (req, redirectUrl, placeholder) {
    const scriptUrl = req.contextPath + '/_static/js/send-code.js';

    const loginServiceUrl = portalLib.idProviderUrl();
    const loginConfigView = resolve('login-config.txt');
    const config = mustacheLib.render(loginConfigView, {
        redirectUrl,
        loginServiceUrl,
    });

    return generatePage(req, {
        title: "Verification",
        subheader: "Check your e-mail for a verification code",
        scriptUrl,
        config,
        body: {
            code: placeholder,
        }
    });
}

function generatePage(req, params) {
    const idProviderConfig = configLib.getConfig();
    params.title = params.title || idProviderConfig.title || "User Login";
    params.theme = idProviderConfig.theme || "light-blue";
    return displayLib.render(req, params);
}

function generateBackgroundStyleUrl(req, theme) {
    const stylePath = "themes/" + theme.split('-', 1)[0] + "-theme.css";
    return req.contextPath + '/_static/' + stylePath;
}

function generateColorStyleUrl(req, theme) {
    const stylePath = "themes/" + theme.split('-', 2)[1] + "-theme.css";
    return req.contextPath + '/_static/' + stylePath;
}
