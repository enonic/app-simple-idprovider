package com.enonic.app.simpleidprovider;

import com.enonic.xp.testing.ScriptRunnerSupport;

public class GravatarScriptTest
    extends ScriptRunnerSupport
{
    @Override
    public String getScriptTestFile()
    {
        return "/lib/gravatar-test.js";
    }
}
