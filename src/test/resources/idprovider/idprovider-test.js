const authMock = require('/lib/xp/mock/auth');
const contextMock = require('/lib/xp/mock/context');
const portalMock = require('/lib/xp/mock/portal');
const idProvider = require('/idprovider/idprovider');
const assert = require('/lib/xp/testing');
// Need to mock email so it does not break everything?

//TODO write test for twoStep login and simple login

exports.testHandle401 = function () {
    const result = idProvider.handle401({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(401 == result.status);
    assertLoginPage(result.body);
};

exports.testGet = function () {
    let result = idProvider.get({
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
        idProvider: "enonic"
    });

    result = idProvider.get({
        params: {}
    });
    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertLogoutPage(result.body);
};

exports.testPostTwoStep = function () {
    //TODO mock userprofile
    authMock.mockUser({
    
    });

    authMock.mockIdProviderConfig({
        title: undefined,
        emailCode: true,
        forgotPassword: {
            site: "test_site",
            email: "no_email@test.com"
        }
    });

    let result = idProvider.post({
        body: JSON.stringify({
            action: "code"
        }),
    });

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertCodePage(result.body);
};

// exports.testTwoStepCodeLogin = function() {

// };

exports.testForgot = function() {
    const result = idProvider.get({
        params: {
            action: "forgot"
        }
    });
    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertForgotPwdPage(result.body);
};

exports.testLogin = function () {
    const result = idProvider.login({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertLoginPage(result.body);
};

exports.testLogout = function () {
    const result = idProvider.logout({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertLoggedOutPage(result.body);
};

function assertCodePage(body) {
    log.error(body);
    assert.assertTrue(body.indexOf("Email code authentication") != -1)
}

function assertLoginPage(body) {
    assert.assertTrue(body.indexOf("User Login Test") != -1);
    assert.assertTrue(body.indexOf("LOG IN") != -1);
}

function assertLogoutPage(body) {
    assert.assertTrue(body.indexOf("LOG IN") == -1);
    assert.assertTrue(body.indexOf("LOG OUT") != -1);
}

function assertLoggedOutPage(body) {
    assert.assertTrue(body.indexOf("Successfully logged out") != -1);
    assert.assertTrue(body.indexOf("LOG IN") != -1);
    assert.assertTrue(body.indexOf("LOG OUT") == -1);
}

function assertForgotPwdPage(body) {
    assert.assertTrue(body.indexOf("Password reset") != -1);
}