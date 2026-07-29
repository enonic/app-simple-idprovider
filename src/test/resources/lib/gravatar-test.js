const gravatarLib = require('/lib/gravatar');
const assert = require('/lib/xp/testing');

exports.testHash = function () {
    assert.assertEquals('0f7675b377ff59e85e37ed6ab24969d9', gravatarLib.hash('noreply@enonic.com'));
};
