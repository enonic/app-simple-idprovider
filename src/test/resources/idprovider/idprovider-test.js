const authMock = require('/lib/xp/mock/auth');
const contextMock = require('/lib/xp/mock/context');
const portalMock = require('/lib/xp/mock/portal');
const mailMock = require('/lib/xp/mock/mail');
const idProvider = require('/idprovider/idprovider');
const assert = require('/lib/xp/testing');
const textEncoding = require("/lib/text-encoding");

exports.testHandle401 = function () {
    const result = idProvider.handle401({
        contextPath: '/_/idprovider/system',
    });

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(401 == result.status);
    assertLoginPage(result.body);
};

exports.testGet = function () {
    let result = idProvider.get({
        method: 'GET',
        rawPath: '/_/idprovider/system',
        contextPath: '/_/idprovider/system',
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
        method: 'GET',
        rawPath: '/_/idprovider/system',
        contextPath: '/_/idprovider/system',
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
        method: 'GET',
        rawPath: '/_/idprovider/system',
        contextPath: '/_/idprovider/system',
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
        method: 'GET',
        rawPath: '/_/idprovider/system',
        contextPath: '/_/idprovider/system',
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
        contextPath: '/_/idprovider/system',
        validTicket: false,
    });

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertLoginPage(result.body);
};

exports.testLogout = function () {
    const result = idProvider.logout({
        contextPath: '/_/idprovider/system',
    });

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

exports.testHandleLoginTwoStepCorrectPassword = function () {
    authMock.mockIdProviderConfig({
        title: "User Login Test",
        twoFactorEmail: true,
        forgotPassword: {
            site: "test_site",
            email: "no_email@test.com",
        },
    });
    authMock.mockUser({
        type: "user",
        key: "user:enonic:mailUser",
        displayName: "mail user",
        login: "mailUser",
        email: "mailUser@enonic.com",
        idProvider: "system",
    });
    authMock.mockLoginResult({ authenticated: true });
    authMock.resetLoginParams();
    mailMock.resetSentMails();

    const result = idProvider.post({
        host: "example.com",
        body: JSON.stringify({
            action: "login",
            user: "mailUser",
            password: "correct-password",
        }),
    });

    const loginParams = authMock.getLastLoginParams();
    assert.assertNotNull(loginParams);
    assert.assertEquals("NONE", loginParams.scope);
    assert.assertEquals("mailUser", loginParams.user);
    assert.assertEquals("correct-password", loginParams.password);

    assert.assertEquals("application/json", result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assert.assertTrue(result.body.twoStep === true);
    assert.assertTrue(result.body.authenticated === true);
    assert.assertNotNull(result.body.userToken);

    const sent = mailMock.getSentMails();
    assert.assertEquals(1, sent.length);
    assert.assertEquals("mailUser@enonic.com", sent[0].to);
};

exports.testHandleLoginTwoStepWrongPassword = function () {
    authMock.mockIdProviderConfig({
        title: "User Login Test",
        twoFactorEmail: true,
        forgotPassword: {
            site: "test_site",
            email: "no_email@test.com",
        },
    });
    authMock.mockUser({
        type: "user",
        key: "user:enonic:mailUser",
        displayName: "mail user",
        login: "mailUser",
        email: "mailUser@enonic.com",
        idProvider: "system",
    });
    authMock.mockLoginResult({ authenticated: false, message: "Access Denied" });
    authMock.resetLoginParams();
    mailMock.resetSentMails();

    const result = idProvider.post({
        host: "example.com",
        body: JSON.stringify({
            action: "login",
            user: "mailUser",
            password: "wrong-password",
        }),
    });

    const loginParams = authMock.getLastLoginParams();
    assert.assertNotNull(loginParams);
    assert.assertEquals("NONE", loginParams.scope);

    assert.assertEquals("application/json", result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assert.assertTrue(!result.body.twoStep);
    assert.assertTrue(!result.body.authenticated);
    assert.assertTrue(!result.body.userToken);

    assert.assertEquals(0, mailMock.getSentMails().length);
};

exports.testHandleCodeLoginCreatesSession = function () {
    const code = "654321";
    const userToken = "session-token";

    authMock.mockUser({
        displayName: "mail user",
        login: "mailUser",
        email: "mailUser@enonic.com",
        key: "user:enonic:mailUser",
        profile: {
            userLogin: {
                salt: "s",
                twoStepToken: textEncoding.sha256(userToken + code + "s"),
                twoStepTimestamp: Date.now(),
            },
        },
    });
    authMock.mockIdProviderConfig({
        title: "User Login Test",
        twoFactorEmail: true,
        forgotPassword: {
            site: "test_site",
            email: "no_email@test.com",
        },
    });
    authMock.mockLoginResult({ authenticated: true });
    authMock.resetLoginParams();

    const result = idProvider.post({
        body: JSON.stringify({
            action: "code",
            code,
            userToken,
            user: "mailUser",
        }),
    });

    const loginParams = authMock.getLastLoginParams();
    assert.assertNotNull(loginParams);
    assert.assertEquals("SESSION", loginParams.scope);
    assert.assertTrue(loginParams.skipAuth === true);

    assert.assertEquals("application/json", result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
};

exports.testHandleCodeLoginRejectsWrongCode = function () {
    const code = "111111";
    const userToken = "another-token";

    authMock.mockUser({
        displayName: "mail user",
        login: "mailUser",
        email: "mailUser@enonic.com",
        key: "user:enonic:mailUser",
        profile: {
            userLogin: {
                salt: "s",
                twoStepToken: textEncoding.sha256(userToken + "999999" + "s"),
                twoStepTimestamp: Date.now(),
            },
        },
    });
    authMock.resetLoginParams();

    const result = idProvider.post({
        body: JSON.stringify({
            action: "code",
            code,
            userToken,
            user: "mailUser",
        }),
    });

    assert.assertEquals(403, result.status);
    assert.assertTrue(result.body.authenticated === false);
    assert.assertNull(authMock.getLastLoginParams());
};