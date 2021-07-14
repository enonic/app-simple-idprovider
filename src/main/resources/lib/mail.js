const mailLib = require('/lib/xp/mail');
const portalLib = require('/lib/xp/portal');
const configLib = require('/lib/config');

exports.sendResetMail = function (req, to, token) {
    const passwordResetUrl = portalLib.idProviderUrl({
        params: {
            action: "reset",
            token: token
        },
        type: 'absolute'
    });

    const body =
        '<p>To reset your password on ' + configLib.getSite() +
        ', please click on the following link: <a href="' + passwordResetUrl + '">Click here</a></p>' +
        "<p>If you don't want to reset your password or if you didn't request this, you can safely ignore this email.</p>";

    sendMail(req, to, "Password reset", body);
};

exports.sendIncorrectResetMail = function (req, to) {
    const body =
        '<p>A request to reset your password on ' + configLib.getSite() +
        ' has been made, but there is no user linked to this email address. </p>' +
        "<p>If you don't want to reset your password or if you didn't request this, you can safely ignore this email.</p>";
    sendMail(req, to, "Password reset", body);
};

exports.sendUpdatedPasswordMail = function (req, to) {
    const body = '<p>You have successfully changed your password on ' + configLib.getSite() +
               '.</p>';
    sendMail(req, to, "Password updated", body);
}


function sendMail(req, to, subject, body) {
    const from = configLib.getEmail() || ('noreply@' + req.host);
    mailLib.send({
        from: from,
        to: to,
        subject: subject,
        body: body,
        contentType: 'text/html; charset="UTF-8"'
    });
}
