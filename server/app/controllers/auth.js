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
      const gUserDetails = await authService.getUserDetailsFromIdToken(token);
      
       // generate jwt
       const jwt = await tryGetUserAndCreateJwt(gUserDetails.email);
     
       if (!jwt.success){
         res.status(400).json(jwt.error);
         return;
       }
       // TODO: return user id and rate
       res.json({ token : jwt.payload, user : { firstName: gUserDetails.given_name } });
    }
    catch (e) {
      console.log(e);
      res.status(401).json("Invalid auth payload");
    }
   
});

/** This is the signup function, 
 * Simlar to auth, but instead we will create the user if it does not exists. */
router.post('/signUp', async (req, res) => { 

  try{      
    const { token }  = req.body
    const gUserDetails = await authService.getUserDetailsFromIdToken(token);
    
     // generate jwt
     const user = await userService.tryGetOrCreateUser(gUserDetails);
   
     if (!user.success){
       res.status(400).json(user.error);
       return;
     }

     res.json(user.payload);
  }
  catch (e) {
    console.log(e);
    res.status(401).json("Invalid auth payload");
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
        res.status(400).json(jwt.error);
        return;
      }

      res.json({ token : jwt.payload });
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
