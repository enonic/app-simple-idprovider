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

__.registerMock('/site/lib/xp/auth.js', mock);
