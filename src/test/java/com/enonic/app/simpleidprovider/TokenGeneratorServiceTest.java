package com.enonic.app.simpleidprovider;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class TokenGeneratorServiceTest
{
    private TokenGeneratorService tokenGeneratorService;

    @BeforeEach
    public void setUp()
    {
        tokenGeneratorService = new TokenGeneratorService();
    }

    @Test
    public void testTokenGeneration()
    {
        final String token = tokenGeneratorService.generateToken();
        final String token2 = tokenGeneratorService.generateToken();
        assertNotNull( token );
        assertNotNull( token2 );
        assertEquals( 32, token.length() );
        assertEquals( 32, token2.length() );
        assertNotEquals( token, token2 );
    }

}
