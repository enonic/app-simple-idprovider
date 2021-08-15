// Entire file is copy from app-users

function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }
    return value;
}

function nullOrValue(value) {
    return value == null ? null : value;
}

/**
 * Creates an id provider.
 *
 * @param {string} name Id provider name.
 * @param {string} [params.displayName] Id provider display name.
 * @param {string} [params.description] Id provider  description.
 * @param {object} [params.idProviderConfig] ID Provider configuration.
 * @param {object} [params.permissions] Id provider permissions.
 */
 exports.createIdProvider = function (params) {
    var bean = __.newBean('com.enonic.xp.app.simpleidprovider.lib.auth.CreateIdProviderHandler');

    bean.name = required(params, 'name');
    bean.displayName = nullOrValue(params.displayName);
    bean.description = nullOrValue(params.description);
    bean.idProviderConfig = __.toScriptValue(params.idProviderConfig);
    bean.permissions = __.toScriptValue(params.permissions);

    return __.toNativeObject(bean.createIdProvider());
};

/**
 * Returns the list of all the id providers.
 *
 * @returns {object[]} Array of id providers.
 */
 exports.getIdProviders = function () {
    var bean = __.newBean('com.enonic.xp.app.simpleidprovider.lib.auth.GetIdProvidersHandler');
    return __.toNativeObject(bean.getIdProviders());
};
