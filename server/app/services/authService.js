const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");
const https = require('https');
const dataService = require("./dataService");

// initialize variables
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

async function getUserDetailsFromIdToken(token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
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

  // cretae JWT token, using secret from config
  const token = jwt.sign({ userId : user.id }, process.env.JWT_SECRET); 

  return { success : true, payload : token };
}

/** Verify that the JWT recieved is valid */
function tryVerifyJwt(token, callback){

  // check expiry

  jwt.verify(token, process.env.JWT_SECRET,  function(err, decoded)
  { 
    if (err){
      result = { success : false, error : err.message};
    }
    else{
      result =  { success : true, payload : decoded};
    }    
   
    callback(result);
  });  
}

async function tryCreateUser(userEmail){

  // we will restrict the total number of users to 50, 
  // just to make sure we do not ramp up hosting costs and since this is a demo only
  let userCount = await dataService.getCollectionSize("users");
  if (userCount > 50){
    return { success : false, error : "ma"};
  }
}

module.exports.getUserDetailsFromIdToken = getUserDetailsFromIdToken;
module.exports.getUserDetailsFromAccessToken = getUserDetailsFromAccessToken;
module.exports.tryGenerateJwt = tryGenerateJwt;
module.exports.tryVerifyJwt = tryVerifyJwt;

