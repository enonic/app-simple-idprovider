exports.generateToken = function () {
    var bean = __.newBean('com.enonic.app.simpleidprovider.TokenGeneratorService');
    return bean.generateToken();
};