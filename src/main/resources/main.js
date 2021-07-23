// const nodeLib = require('/lib/xp/node');
const userAuth = require('/lib/auth');
const contextLib = require('/lib/context');

function exists(providers) {
    for (let i = 0; i < providers.length; i++) {
        if (
            providers[i].idProviderConfig &&
            providers[i].idProviderConfig.applicationKey ===
                'com.enonic.app.simpleidprovider'
        ) {
            return true;
        }
    }
    return false;
}

function initUserStore() {
    let systemidproviders;

    contextLib.runAsAdmin(function () {
        systemidproviders = userAuth.getIdProviders();
    });

    if (exists(systemidproviders) === false) {
        log.info('TODO setup new userstore');
    }
}

initUserStore();
