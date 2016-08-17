var authLib = require('/lib/xp/auth');
var mailLib = require('/lib/xp/mail');

exports.sendResetMail = function (req, to, passwordResetUrl) {
    var body =
        '<p>To reset your password on <a href="' + req.scheme + '://' + req.host + ':' + req.port + '">' + req.host +
        '</a>, please click on the following link:</p>' +
        '<a href="' + passwordResetUrl + '">' + passwordResetUrl + '</a>' +
        "<p>If you don't want to reset your password or if you didn't request this, you can safely ignore this email.</p>";

    sendMail(req, to, "Password reset", body);
};

exports.sendIncorrectResetMail = function (req, to) {
    var body =
        '<p>A request to reset your password on <a href="' + req.scheme + '://' + req.host + ":" + req.port + '">' + req.host +
        '</a> has been made, but there is no user linked to this email address. </p>' +
        "<p>If you don't want to reset your password or if you didn't request this, you can safely ignore this email.</p>";
    sendMail(req, to, "Password reset", body);
};

exports.sendUpdatedPasswordMail = function (req, to) {
    var body = '<p>You have successfully changed your password on <a href="' + req.scheme + '://' + req.host + ":" + req.port + '">' +
               req.host + '</a>.</p>';
    sendMail(req, to, "Password updated", body);
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
