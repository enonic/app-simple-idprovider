exports.hash = function (email) {
    var bean = __.newBean('com.enonic.app.simpleidprovider.GravatarHashHandler');
    bean.setEmail(email);
    return bean.execute();
};