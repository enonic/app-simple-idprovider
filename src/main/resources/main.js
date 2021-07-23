const nodeLib = require('/lib/xp/node');
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
        branch: "master"
    });
    const systemidproviders = repoConnection.findChildren({
        "parent-path": "/identity",
        start: 0,
        count: 100,
    });

    log.info("connection astablished");

    if (exists(systemidproviders.hits) === false) {
        contextLib.runAsAdmin
        const result = repoConnection.create({
            _name: "simpleidprovider",
            _parentPath: "/identity",
            idProvider: {
                applicationKey: "com.enonic.app.simpleidprovider",
            }
        });

        if (result) {
            log.info("Created simple idprovider userstore");
        }
    }
}

initUserStore();
