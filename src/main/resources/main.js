const idproviderLib = require('/lib/idprovider');
const context = require('/lib/context');

/**
 * Checks all idproviders if they are connected to the simpleidprovider
 * 
 * @param {Array} providers 
 * @returns {Boolean} true if exists, false if not 
 */
function exists(providers) {
    for (const count in providers) {
        if (
            providers[count] &&
            providers[count].idProviderConfig &&
            providers[count].idProviderConfig.applicationKey ==
                'com.enonic.app.simpleidprovider'
        ) {
            return true;
        }
    }
    return false;
}

function initUserStore() {
    let systemidproviders;
    context.runAsAdmin(function () {
        systemidproviders = idproviderLib.getIdProviders();
    });

    if (exists(systemidproviders) === false) {
        let result;
        context.runAsAdmin(function () {
            result = idproviderLib.createIdProvider({
                name: 'simpleuserstore',
                descripton: 'Default simple-idprovider',
                idProviderConfig: {
                    applicationKey: 'com.enonic.app.simpleidprovider',
                    config: [
                        //TODO set default config
                    ],
                },
                permissions: [
                    {
                        principal: 'user:simpleuserstore:admin',
                        access: 'ADMINISTRATOR',
                    },
                    {
                        principal: 'user:simpleuserstore:user',
                        access: 'READ',
                    },
                ],
            });
        });

        if (result) {
            log.info('Created simple idprovider userstore');
        }
    }
}

initUserStore();
