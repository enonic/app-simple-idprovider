package com.enonic.xp.app.users.lib.auth;

import com.enonic.xp.script.serializer.MapGenerator;
import com.enonic.xp.script.serializer.MapSerializable;
import com.enonic.xp.security.Principal;
import com.enonic.xp.security.User;
import com.enonic.xp.security.acl.IdProviderAccess;

public class IdProviderAccessControlEntryMapper
    implements MapSerializable
{
    private final Principal principal;

    private final IdProviderAccess access;

    public IdProviderAccessControlEntryMapper( final Principal principal, final IdProviderAccess access )
    {
        this.principal = principal;
        this.access = access;
    }


    private void serialize( final MapGenerator gen, final Principal principal, final IdProviderAccess access )
    {
        serializePrincipal( gen, principal );
        gen.value( "access", access.toString() );
    }

    private void serializePrincipal( final MapGenerator gen, final Principal principal )
    {
        gen.map( "principal" );
        gen.value( "type", principal.getClass().getSimpleName().toLowerCase() );
        gen.value( "key", principal.getKey() );
        gen.value( "displayName", principal.getDisplayName() );
        gen.value( "modifiedTime", principal.getModifiedTime() );
        if ( principal instanceof User )
        {
            final User user = (User) principal;
            gen.value( "disabled", user.isDisabled() );
            gen.value( "email", user.getEmail() );
            gen.value( "login", user.getLogin() );
            gen.value( "idProvider", user.getKey() != null ? user.getKey().getIdProviderKey() : null );
            gen.value( "hasPassword", user.getAuthenticationHash() != null );
        }
        else
        {
            gen.value( "description", principal.getDescription() );
        }
        gen.end();
    }

    @Override
    public void serialize( final MapGenerator gen )
    {
        serialize( gen, this.principal, this.access );
    }
}
