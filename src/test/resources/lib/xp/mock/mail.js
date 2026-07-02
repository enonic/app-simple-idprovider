const sentMails = [];

const mock = {
    send: function (params) {
        sentMails.push(params);
    }
};

exports.getSentMails = function () {
    return sentMails;
};

exports.resetSentMails = function () {
    sentMails.length = 0;
};

__.registerMock('/lib/xp/mail.js', mock);
