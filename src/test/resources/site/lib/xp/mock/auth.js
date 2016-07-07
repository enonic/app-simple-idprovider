var idProviderConfigJson = {
    title: "mytitle"
};

var mock = {
    getIdProviderConfig: function () {
        return idProviderConfigJson;
    }
};

__.registerMock('/site/lib/xp/auth.js', mock);
