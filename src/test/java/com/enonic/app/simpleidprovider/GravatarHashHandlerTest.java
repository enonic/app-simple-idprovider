package com.enonic.app.simpleidprovider;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class GravatarHashHandlerTest
{
    private GravatarHashHandler gravatarHashHandler;

    @Before
    public void setUp()
    {
        gravatarHashHandler = new GravatarHashHandler();
    }

    @Test
    public void testTokenGeneration()
        throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        gravatarHashHandler.setEmail( "noreply@enonic.com" );
        final String hash = gravatarHashHandler.execute();
        Assert.assertEquals( "0f7675b377ff59e85e37ed6ab24969d9", hash );
    }

}
