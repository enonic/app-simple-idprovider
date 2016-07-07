require('/lib/xp/mock/auth');
require('/lib/xp/mock/portal');
var idProvider = require('/idprovider/idprovider');
var assert = require('/lib/xp/assert');

exports.testHandle401 = function () {
    var result = idProvider.handle401({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertNotNull(result.body);
};