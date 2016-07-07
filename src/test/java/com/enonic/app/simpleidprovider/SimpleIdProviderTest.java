package com.enonic.app.simpleidprovider;

import com.enonic.xp.testing.script.ScriptRunnerSupport;

public class SimpleIdProviderTest
    extends ScriptRunnerSupport
{
    @Override
    public String getScriptTestFile()
    {
        return "/idprovider/idprovider-test.js";
    }
}
