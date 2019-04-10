var siteJson = {};


var mock = {
    run: function (params, callback) {
        return callback();
    }
};

__.registerMock('/lib/xp/context.js', mock);
