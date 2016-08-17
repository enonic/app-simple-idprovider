package com.enonic.app.simpleidprovider;

import java.math.BigInteger;
import java.security.SecureRandom;

import org.osgi.service.component.annotations.Component;

@Component(immediate = true)
public class TokenGeneratorService
{
    private final SecureRandom secureRandom = new SecureRandom();

    public synchronized String generateToken()
    {
        return new BigInteger( 160, secureRandom ).toString( 32 );
    }
}
