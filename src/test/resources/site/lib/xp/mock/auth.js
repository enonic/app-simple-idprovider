var idProviderConfigJson = {
    title: "User Login Test"
};
var userJson = null;

var mock = {
    getUser: function () {
        return userJson;
    },
    getIdProviderConfig: function () {
        return idProviderConfigJson;
    },
    logout: function () {
        userJson = null;
    }
};

exports.mockUser = function (json) {
    userJson = json;
};

__.registerMock('/site/lib/xp/auth.js', mock);
