require('/lib/xp/mock/auth');
require('/lib/xp/mock/portal');
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
    assert.assertTrue(result.body.indexOf("LOGIN") > -1);
    
    
};