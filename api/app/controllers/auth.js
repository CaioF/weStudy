// import libraries
const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const userService = require('../services/userDataService');

// Setup POST methods
/*************** POST ***************/

/** This is the auth function, 
 * users will be sent here after authenitcating with thier google login. */
router.post('/auth', async (req, res) => { 

    try{      
      const { token }  = req.body
      const userDetails = await authService.getUserDetailsFromIdToken(token);
      
       // generate jwt
       const jwt = await tryGetUserAndCreateJwt(userDetails.email);
     
       if (!jwt.success){
         res.status(400).send(jwt.error);
         return;
       }
 
       res.send({ token : jwt.payload });
    }
    catch (e) {
      console.log(e);
      res.status(401).send("Invalid auth payload");
    }
   
});

/** Exchange the google access token for a local JWT token 
 * when NOT using the UI to authenticate */
router.post('/token', async (req, res) => { 

  try{      

    // Get the auth header
    const authHeader = req.headers["authorization"];
    if (!authHeader){
      res.status(401).send("No auth header");
      return;
    }

    // get user details
    authService.getUserDetailsFromAccessToken(authHeader.replace("Bearer ", ''), async function(statusCode, userDetails){
      if (statusCode != 200){
        res.status(statusCode).send("Error reading auth header");
        return;
      }

      // generate jwt
      const jwt = await tryGetUserAndCreateJwt(userDetails.email);
     
      if (!jwt.success){
        res.status(400).send(jwt.error);
        return;
      }

      res.send({ token : jwt.payload });
    });
  }
  catch (e) {
    console.log(e);
    res.status(401).send("Invalid auth payload");
  }
 
});

async function tryGetUserAndCreateJwt(userEmail){
  // get user from DB      
  var user = await userService.tryGetUserByEmail(userEmail);

  if (!user.success){
    return user;
  }

  var jwt = authService.tryGenerateJwt(user.payload);
  return jwt;
}

module.exports = router;
