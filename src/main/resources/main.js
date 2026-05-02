const authLib = require("/lib/xp/auth");
const context = require("/lib/context");
const clusterLib = require("/lib/xp/cluster");
const taskLib = require("/lib/xp/task");

const APP_KEY = "com.enonic.app.simpleidprovider";
const ID_PROVIDER_KEY = "simpleid";
const ID_PROVIDER_DISPLAY_NAME = "Simple ID Provider";
const ID_PROVIDER_DESCRIPTION = "Default simple-idprovider";

function existsForApp(providers, applicationKey) {
    return providers.some(function (provider) {
        return (
            provider &&
            provider.idProviderConfig &&
            provider.idProviderConfig.applicationKey === applicationKey
        );
    });
}

function initIdProvider() {
    try {
        const idProviders = authLib.getIdProviders();

        if (existsForApp(idProviders, APP_KEY)) {
            log.info("Simple id provider already exists, skipping provisioning.");
            return;
        }

        authLib.createIdProvider({
            key: ID_PROVIDER_KEY,
            displayName: ID_PROVIDER_DISPLAY_NAME,
            description: ID_PROVIDER_DESCRIPTION,
            idProviderConfig: {
                applicationKey: APP_KEY,
                config: {}
            }
        });
        log.info("Created simple id provider '" + ID_PROVIDER_KEY + "'.");
    } catch (e) {
        log.warning("Failed to provision simple id provider: " + e.message);
    }
}

if (clusterLib.isMaster()) {
    context.runAsAdmin(function () {
        taskLib.executeFunction({
            description: "Provision simple id provider",
            func: initIdProvider,
        });
    });
}
