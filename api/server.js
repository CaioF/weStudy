const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { OAuth2Client } = require('google-auth-library')

const app = express()
const port = 3001
const clientId = "3959710917-u5fgrd58uoi3e7m12i5e1i9cnuotsalu.apps.googleusercontent.com";
const client = new OAuth2Client(clientId)

app.use(cors())
app.use(bodyParser.json());

app.use("/api/users", require("./routers/users"));
//TODO: move to seperate module

app.get('/', async (req, res) => { 
  res.send("hello");
});

app.post('/api/auth', async (req, res) => { 

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

app.listen(port, () => {  
  console.log(`weStudy listening at http://localhost:${port}`)
})