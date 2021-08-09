package com.enonic.app.simpleidprovider;

import java.util.Comparator;
import java.util.concurrent.Callable;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import com.enonic.xp.context.Context;
import com.enonic.xp.context.ContextBuilder;
import com.enonic.xp.portal.PortalRequest;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.security.IdProvider;
import com.enonic.xp.security.IdProviderKey;
import com.enonic.xp.security.IdProviders;
import com.enonic.xp.security.RoleKeys;
import com.enonic.xp.security.SecurityConstants;
import com.enonic.xp.security.SecurityService;
import com.enonic.xp.security.SystemConstants;
import com.enonic.xp.security.User;
import com.enonic.xp.security.auth.AuthenticationInfo;
import com.enonic.xp.security.auth.EmailPasswordAuthToken;
import com.enonic.xp.security.auth.UsernamePasswordAuthToken;
import com.enonic.xp.security.auth.VerifiedEmailAuthToken;
import com.enonic.xp.security.auth.VerifiedUsernameAuthToken;
import com.enonic.xp.session.Session;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

import org.osgi.service.component.annotations.Component;

@Component(immediate = true)
public final class AuthenticateHandler
    implements ScriptBean
{
    // private static final Logger LOG = LoggerFactory.getLogger( AuthenticationInfo.class );

    private String user;

    private String password;

    private boolean skipAuth;

    private String[] idProvider;

    private Supplier<SecurityService> securityService;

    private Supplier<Context> context;

    private Supplier<PortalRequest> portalRequestSupplier;

    public void setUser( final String user )
    {
        this.user = user;
    }

    public void setPassword( final String password )
    {
        this.password = password;
    }

    public void setSkipAuth( final boolean skipAuth )
    {
        this.skipAuth = skipAuth;
    }

    public void setIdProvider( final String[] idProvider )
    {
        this.idProvider = idProvider;
    }

    public boolean attemptLogin()
    {

        for ( String uStore : idProvider )
        {
            final AuthenticationInfo authInfo = authenticate( IdProviderKey.from( uStore ) );
            if (authInfo != null) {
                return authInfo.isAuthenticated();
            }
        }

        return AuthenticationInfo.unAuthenticated().isAuthenticated();
    }

    private AuthenticationInfo authenticate( IdProviderKey idProvider )
    {
        AuthenticationInfo authInfo = null;

        if ( isValidEmail( this.user ) )
        {
            if ( this.skipAuth )
            {
                final VerifiedEmailAuthToken verifiedEmailAuthToken = new VerifiedEmailAuthToken();
                verifiedEmailAuthToken.setEmail( this.user );
                verifiedEmailAuthToken.setIdProvider( idProvider );

                authInfo = runAsAuthenticated( () -> this.securityService.get().authenticate( verifiedEmailAuthToken ) );
            }
            else
            {
                final EmailPasswordAuthToken emailAuthToken = new EmailPasswordAuthToken();
                emailAuthToken.setEmail( this.user );
                emailAuthToken.setPassword( this.password );
                emailAuthToken.setIdProvider( idProvider );

                authInfo = runAsAuthenticated( () -> this.securityService.get().authenticate( emailAuthToken ) );
            }
        }

        if ( authInfo == null || !authInfo.isAuthenticated() )
        {
            if ( this.skipAuth )
            {
                final VerifiedUsernameAuthToken usernameAuthToken = new VerifiedUsernameAuthToken();
                usernameAuthToken.setUsername( this.user );
                usernameAuthToken.setIdProvider( idProvider );

                authInfo = runAsAuthenticated( () -> this.securityService.get().authenticate( usernameAuthToken ) );
            }
            else
            {
                final UsernamePasswordAuthToken usernameAuthToken = new UsernamePasswordAuthToken();
                usernameAuthToken.setUsername( this.user );
                usernameAuthToken.setPassword( this.password );
                usernameAuthToken.setIdProvider( idProvider );

                authInfo = runAsAuthenticated( () -> this.securityService.get().authenticate( usernameAuthToken ) );
            }
        }

        return authInfo;
    }

    private <T> T runAsAuthenticated( Callable<T> runnable )
    {
        final AuthenticationInfo authInfo = AuthenticationInfo.create().principals( RoleKeys.AUTHENTICATED ).user( User.ANONYMOUS ).build();
        return ContextBuilder.from( this.context.get() ).
            authInfo( authInfo ).
            repositoryId( SystemConstants.SYSTEM_REPO_ID ).
            branch( SecurityConstants.BRANCH_SECURITY ).build().
            callWith( runnable );
    }

    private boolean isValidEmail( final String value )
    {
        return value != null && value.chars().filter( ch -> ch == '@' ).count() == 1;
    }

    @Override
    public void initialize( final BeanContext context )
    {
        this.securityService = context.getService( SecurityService.class );
        this.context = context.getBinding( Context.class );
        this.portalRequestSupplier = context.getBinding( PortalRequest.class );
    }
}
