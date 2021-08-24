const idproviderLib = require("/lib/idprovider");
const context = require("/lib/context");
const clusterLib = require("/lib/xp/cluster");
const taskLib = require("/lib/xp/task");

/**
 * Checks all idproviders if they are connected to the simpleidprovider
 *
 * @param {Array} providers
 * @returns {Boolean} true if exists, false if not
 */
function exists(providers, key) {
    for (const count in providers) {
        if (
            providers[count] &&
            providers[count].idProviderConfig &&
            providers[count].idProviderConfig.applicationKey === key
        ) {
            return true;
        }
    }
    return false;
}

function initUserStore() {
    const systemidproviders = idproviderLib.getIdProviders();

    if (exists(systemidproviders, "com.enonic.app.simpleidprovider") === false) {
        const result = idproviderLib.createIdProvider({
            name: "simpleid",
            descripton: "Default simple-idprovider",
            idProviderConfig: {
                applicationKey: "com.enonic.app.simpleidprovider",
                config: [],
            },
            permissions: [],
        });

        if (result) {
            log.info("Created simple idprovider userstore");
        }
    }
}

if (clusterLib.isMaster()) {
    context.runAsAdmin(function () {
        taskLib.executeFunction({
            description: "Create default simpleId userstore",
            func: initUserStore,
        });
    });
}
