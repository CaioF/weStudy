// import libraries
var express = require("express");
const router = express.Router();
const { OAuth2Client } = require('google-auth-library')

// initialize variables
const clientId = "3959710917-u5fgrd58uoi3e7m12i5e1i9cnuotsalu.apps.googleusercontent.com";
const client = new OAuth2Client(clientId)

// Setup GET methods
/*************** GET ***************/

// Setup POST methods
/*************** POST ***************/

/** This is the auth function, 
 * users will be sent here after authenitcating with thier google login. */
router.post('/api/auth', async (req, res) => { 

    try{      
      const { token }  = req.body
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId
      });
  
      var userDetails = ticket.getPayload();
  
      //TODO: get or create local user
      res.send({ firstName : userDetails.given_name, lastName : userDetails.family_name, email : userDetails.email });
    }
    catch (e) {
      console.log(e);
      res.status(401).send("Invalid auth payload");
    }
   
});


module.exports = router;