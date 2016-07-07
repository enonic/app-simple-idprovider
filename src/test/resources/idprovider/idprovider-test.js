var authMock = require('/lib/xp/mock/auth');
var portalMock = require('/lib/xp/mock/portal');
var idProvider = require('/idprovider/idprovider');
var assert = require('/lib/xp/assert');

exports.testHandle401 = function () {
    var result = idProvider.handle401({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(401 == result.status);
    assertLoginPage(result.body);
};

exports.testGet = function () {
    var result = idProvider.get({
        params: {}
    });
    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assert.assertNotNull(result.body);
    assertLoginPage(result.body);

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

    var result = idProvider.get({
        params: {}
    });
    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertLogoutPage(result.body);

    var result = idProvider.get({
        params: {
            forgot: "true"
        }
    });
    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertForgotPwdPage(result.body);
}
;

exports.testLogin = function () {
    var result = idProvider.login({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertLoginPage(result.body);
};

exports.testLogout = function () {
    var result = idProvider.logout({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertLoggedOutPage(result.body);
};

function assertLoginPage(body) {
    assert.assertTrue(body.indexOf("User Login Test") != -1);
    assert.assertTrue(body.indexOf("LOGIN") != -1);
}

function assertLogoutPage(body) {
    assert.assertTrue(body.indexOf("LOGIN") == -1);
    assert.assertTrue(body.indexOf("LOGOUT") != -1);
}

function assertLoggedOutPage(body) {
    assert.assertTrue(body.indexOf("Successfully logged out!") != -1);
    assert.assertTrue(body.indexOf("LOGIN") != -1);
    assert.assertTrue(body.indexOf("LOGOUT") == -1);
}

function assertForgotPwdPage(body) {
    assert.assertTrue(body.indexOf("Password reset") != -1);
}