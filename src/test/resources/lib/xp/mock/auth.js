let idProviderConfigJson = {
    title: "User Login Test",
    forgotPassword: {
        email: "noreply@example.com",
        site: "WebsiteTest"
    }
};
let userJson = null;

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
    login: function () {
        return;
    },
    modifyProfile: function() {
        return;
    }
};

exports.mockIdProviderConfig = function(data) {
    idProviderConfigJson = {
        title: data.title,
        emailCode: data.emailCode,
        forgotPassword: data.forgotPassword,
    }
};

exports.mockUser = function (json) {
    userJson = json;
};

__.registerMock('/lib/xp/auth.js', mock);
