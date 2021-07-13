const twoStep = require("/lib/twoFactorAuth");

exports.get = function(req) {
  let body = {};

  const params = req.params;
  if (params && params.secret) {
    const token = params.token; // 6 code
    const secret = params.secret; // full user code saved localy
    body.valid = twoStep.isValidSecret(secret, token);
      
  } else {
    body.token = twoStep.generateToken();
  }

  return {
    body,
    mimeType: "application/json"
  };
};

//test code: 4K2MLVN2FHR3SXXZ5USQTDDMGYM44PQW