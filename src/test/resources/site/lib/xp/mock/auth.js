var idProviderConfigJson = {
    title: "mytitle"
};
var userJson = null;

var mock = {
    getUser: function () {
        return userJson;
    },
    getIdProviderConfig: function () {
        return idProviderConfigJson;
    }
};

exports.mockUser = function (json) {
    userJson = json;
};

__.registerMock('/site/lib/xp/auth.js', mock);
