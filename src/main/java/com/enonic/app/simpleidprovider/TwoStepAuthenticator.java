package com.enonic.app.simpleidprovider;

import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;


public class TwoStepAuthenticator
    implements ScriptBean
{
    public Boolean isValidCode(final String secret, final String code) {
      TimeProvider timeProvider = new SystemTimeProvider();
      CodeGenerator codeGenerator = new DefaultCodeGenerator();
      CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);

      return verifier.isValidCode(secret, code);
    }

    @Override
    public void initialize( final BeanContext context )
    {

    }
}
