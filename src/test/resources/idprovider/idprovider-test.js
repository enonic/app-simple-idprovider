var authMock = require('/lib/xp/mock/auth');
var portalMock = require('/lib/xp/mock/portal');
var idProvider = require('/idprovider/idprovider');
var assert = require('/lib/xp/assert');

exports.testHandle401 = function () {
    var result = idProvider.handle401({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(401 == result.status);
    assert.assertNotNull(result.body);
};


exports.testGet = function () {
    var result = idProvider.get({});
    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assert.assertNotNull(result.body);
    assert.assertTrue(result.body.indexOf("LOGIN") != -1);
    assert.assertTrue(result.body.indexOf("LOGOUT") == -1);

    authMock.mockUser({
        type: "user",
        key: "user:enonic:user1",
        displayName: "User 1",
        modifiedTime: "1970-01-01T00:00:00Z",
        disabled: false,
        email: "user1@enonic.com",
        login: "user1",
        userStore: "enonic"
    });

    var result = idProvider.get({});
    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assert.assertNotNull(result.body);
    assert.assertTrue(result.body.indexOf("LOGIN") == -1);
    assert.assertTrue(result.body.indexOf("LOGOUT") != -1);
    assert.assertTrue(result.body.indexOf("User 1") != -1);
};