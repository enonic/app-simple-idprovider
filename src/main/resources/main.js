const nodeLib = require("/lib/xp/node");
// const contextLocal = require("/lib/context");
const contextLib = require('/lib/xp/context');


function exists(providers) {
    for (const idprovider in providers) {
        log.info(idprovider._name);
        if (idprovider.idprovider) {
            for (apps in [].concat(idprovider.idProvider)) {
                if (apps.applicationKey === "com.enonic.app.simpleidprovider") {
                    return true;
                }
            }
        }
    }
    return false;
}

function initUserStore() {
    const repoConnection = nodeLib.connect({
        repoId: "system-repo",
        branch: "master",
    });

    log.info(`Exists: ${repoConnection.exists('/identity')}`);
    const systemidproviders = repoConnection.findChildren({
        start: 0,
        count: 100,
        parentKey: "identity",
    });

    log.info("connection established");
    log.info(systemidproviders.total);

    if (exists(systemidproviders.hits) === false) {
        const result = contextLib.run(
            {
                repository: "system-repo",
                branch: "master",
                user: {
                    login: "su",
                    idProvider: "system",
                },
                principals: ["role:system.admin"],
            },
            createUserStore(repoConnection)
        );

        if (result) {
            log.info("Created simple idprovider userstore");
        }
    }
}

function createUserStore(connection) {
    return connection.create({
        _name: "simpleidprovider",
        _parentPath: "/identity",
        idProvider: {
            applicationKey: "com.enonic.app.simpleidprovider",
        },
    });
}

initUserStore();
