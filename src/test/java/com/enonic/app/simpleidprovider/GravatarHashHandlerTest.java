package com.enonic.app.simpleidprovider;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GravatarHashHandlerTest
{
    private GravatarHashHandler gravatarHashHandler;

    @BeforeEach
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
        assertEquals( "0f7675b377ff59e85e37ed6ab24969d9", hash );
    }

}
