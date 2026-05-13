package com.enonic.xp.app.users.lib.auth;

import java.util.List;

import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.security.RoleKeys;
import com.enonic.xp.security.SecurityService;
import com.enonic.xp.security.acl.IdProviderAccess;
import com.enonic.xp.security.acl.IdProviderAccessControlEntry;
import com.enonic.xp.security.acl.IdProviderAccessControlList;

public final class DefaultPermissionsHandler
    extends AbstractPermissionsHandler
{
    private static final IdProviderAccessControlList DEFAULT_ID_PROVIDER_ACL = IdProviderAccessControlList.of(
        IdProviderAccessControlEntry.create().principal( RoleKeys.ADMIN ).access( IdProviderAccess.ADMINISTRATOR ).build(),
        IdProviderAccessControlEntry.create().principal( RoleKeys.USER_MANAGER_ADMIN ).access( IdProviderAccess.ADMINISTRATOR ).build(),
        IdProviderAccessControlEntry.create().principal( RoleKeys.AUTHENTICATED ).access( IdProviderAccess.READ ).build() );

    public List<IdProviderAccessControlEntryMapper> defaultPermissions()
    {
        return mapIdProviderPermissions( DEFAULT_ID_PROVIDER_ACL );
    }

    @Override
    public void initialize( final BeanContext context )
    {
        securityService = context.getService( SecurityService.class );
    }
}
