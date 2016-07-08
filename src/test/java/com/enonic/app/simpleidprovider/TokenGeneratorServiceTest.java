package com.enonic.app.simpleidprovider;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TokenGeneratorServiceTest
{
    private TokenGeneratorService tokenGeneratorService;

    @Before
    public void setUp()
    {
        tokenGeneratorService = new TokenGeneratorService();
    }

    @Test
    public void testTokenGeneration()
    {
        final String token = tokenGeneratorService.generateToken();
        final String token2 = tokenGeneratorService.generateToken();
        Assert.assertNotNull( token );
        Assert.assertNotNull( token2 );
        Assert.assertEquals( 32, token.length() );
        Assert.assertEquals( 32, token2.length() );
        Assert.assertNotEquals( token, token2 );
    }

}
