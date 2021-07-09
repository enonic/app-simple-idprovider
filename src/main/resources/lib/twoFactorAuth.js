

exports.generateToken = function() {
  const bean = __.newBean('dev.samstevens.totp.secret.DefaultSecretGenerator');
  return bean.generate();
}

exports.isValidSecret = function(secret, code) {
  const bean = __.newBean('com.enonic.app.simpleidprovider.TwoStepAuthenticator');
  return bean.isValidCode(secret, code);
}