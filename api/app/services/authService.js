const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");
const https = require('https');

// initialize variables
const client = new OAuth2Client(process.env.googleClientId)

async function getUserDetailsFromIdToken(token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.googleClientId
    });
    var userDetails = ticket.getPayload();
    return userDetails;
}

/** Get the user details using the access token */
function getUserDetailsFromAccessToken(accessToken, callback) {
  https.get('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + accessToken, function(res){
        var output = '';
        console.log('Response is '+ res.statusCode);

        res.on('data', function (chunk) {
          output += chunk;
         });

        res.on('end', function () {
          let obj = JSON.parse(output);
          callback(res.statusCode, obj);
        });
  });
}

/** Create a JWT to be used for authentication */
function tryGenerateJwt(user){

  if (!user){
    return { success : false, error : "Invalid user object" };
  }

  const token = jwt.sign({ userId : user.id }, process.env.jwtSecret); 
  return { success : true, payload : token };
}

/** Verify that the JWT recieved is valid */
function tryVerifyJwt(token, callback){

  // check expiry

  jwt.verify(token, process.env.jwtSecret,  function(err, decoded)
  { 
    if (err){
      result = { success : false, error : err .message};
    }
    else{
      result =  { success : true, payload : decoded};
    }    
   
    callback(result);
  });  
}

module.exports.getUserDetailsFromIdToken = getUserDetailsFromIdToken;
module.exports.getUserDetailsFromAccessToken = getUserDetailsFromAccessToken;
module.exports.tryGenerateJwt = tryGenerateJwt;
module.exports.tryVerifyJwt = tryVerifyJwt;

