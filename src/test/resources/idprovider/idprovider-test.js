const authMock = require('/lib/xp/mock/auth');
const contextMock = require('/lib/xp/mock/context');
const portalMock = require('/lib/xp/mock/portal');
const idProvider = require('/idprovider/idprovider');
const assert = require('/lib/xp/testing');
const textEncoding = require("/lib/text-encoding");
// Need to mock email so it does not break everything?

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
    const code = "123456";
    const userToken = "myrandomtoken";

    authMock.mockUser({
        displayName: "mail user",
        login: "mailUser",
        email: "mailUser@enonic.com",
        profile: {
            userLogin: {
                salt: "2",
                twoStepToken: textEncoding.sha256(userToken + code + "2"),
                twoStepTimestamp: Date.now(),
            }
        }
    });

    authMock.mockIdProviderConfig({
        title: undefined,
        twostep: {
            emailCode: true
        },
        forgotPassword: {
            site: "test_site",
            email: "no_email@test.com"
        }
    });

    const result = idProvider.post({
        body: JSON.stringify({
            action: "code",
            code,
            userToken,
            user: "mailUser"
        }),
    });
    
    assert.assertEquals('application/json', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
};

exports.testTwoStepLogin = function() {
    const result = idProvider.get({
        params: {
            action: "code",
        },
    });

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertCodePage(result.body);
};

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
    authMock.mockIdProviderConfig({
        title: "User Login Test",
        emailCode: true,
        forgotPassword: {
            site: "test_site",
            email: "no_email@test.com"
        }
    });

    const result = idProvider.login({
        validTicket: false,
    });

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
    assert.assertTrue(body.indexOf("Verification") != -1)
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