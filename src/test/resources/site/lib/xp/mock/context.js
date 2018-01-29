var siteJson = {};


var mock = {
    run: function (params, callback) {
        return callback();
    }
};

__.registerMock('/site/lib/xp/context.js', mock);
