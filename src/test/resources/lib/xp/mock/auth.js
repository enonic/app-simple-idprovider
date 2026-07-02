let idProviderConfigJson = {
    title: "User Login Test",
    forgotPassword: {
        email: "noreply@example.com",
        site: "WebsiteTest"
    }
};
let userJson = null;
let loginResultJson = null;
let lastLoginParams = null;

const mock = {
    getUser: function () {
        return userJson;
    },
    getIdProviderConfig: function () {
        return idProviderConfigJson;
    },
    logout: function () {
        userJson = null;
    },
    findUsers: function () {
        return { hits: [userJson] };
    },
    login: function (params) {
        lastLoginParams = params;
        return loginResultJson;
    },
    modifyProfile: function() {
        return;
    }
};

exports.mockIdProviderConfig = function(data) {
    idProviderConfigJson = {
        title: data.title,
        siteName: data.siteName,
        twoFactorEmail: data.twoFactorEmail,
        emailCode: data.emailCode,
        forgotPassword: data.forgotPassword,
    }
};

exports.mockUser = function (json) {
    userJson = json;
};

exports.mockLoginResult = function (result) {
    loginResultJson = result;
};

exports.getLastLoginParams = function () {
    return lastLoginParams;
};

exports.resetLoginParams = function () {
    lastLoginParams = null;
};

__.registerMock('/lib/xp/auth.js', mock);
