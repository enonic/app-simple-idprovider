const authMock = require('/lib/xp/mock/auth');
const configLib = require('/lib/config');
const assert = require('/lib/xp/testing');

exports.testGetSiteReadsTopLevelSiteName = function () {
    authMock.mockIdProviderConfig({
        title: "User Login",
        siteName: "Acme Corp",
        forgotPassword: {
            email: "noreply@example.com",
            site: "OldSite"
        }
    });

    assert.assertEquals("Acme Corp", configLib.getSite());
};

exports.testGetSiteFallsBackToForgotPasswordSite = function () {
    authMock.mockIdProviderConfig({
        title: "User Login",
        forgotPassword: {
            email: "noreply@example.com",
            site: "LegacySite"
        }
    });

    assert.assertEquals("LegacySite", configLib.getSite());
};

exports.testGetSiteFallsBackToTitleWhenTwoFactorEnabledAndForgotPasswordDisabled = function () {
    authMock.mockIdProviderConfig({
        title: "Acme Login",
        twoFactorEmail: {}
    });

    assert.assertEquals("Acme Login", configLib.getSite());
};

exports.testGetSiteReturnsDefinedValueWhenOnlyTitleIsSet = function () {
    authMock.mockIdProviderConfig({
        title: "User Login"
    });

    const site = configLib.getSite();
    assert.assertNotNull(site);
    assert.assertTrue(site !== undefined);
    assert.assertTrue(site.indexOf("undefined") === -1);
};
