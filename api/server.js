// import libraries
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const sessions = require('express-session')
const authService = require("./app/services/authService");

// initialize variables
dotenv.config();
const app = express()
const port = process.env.serverPort;

// initialize app (our server)
app.use(cors({
  origin : "http://localhost:3000", // move to config
  credentials: true, 
  allowedHeaders : 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Set-Cookie'
}));

app.use(sessions({
  secret: 'asdasd9032jfdmf39md32mjkjkdm3', // move to config
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(bodyParser.json());

// Api auth middleware
app.use('/api', async (req, res, next) => {

  const authHeader = req.headers["authorization"].replace("Bearer ", '');
  if (!authHeader){
    res.status(401).send("No auth header");
    return;
  }

  authService.tryVerifyJwt(authHeader, function(result){

    if (!result.success){
      res.status(401).send(result.error);
      return;
    }

    // set the userId in the session
    var ses = req.session;
    ses.userId = result.payload.userId;

    next()
  }); 
})

// configure routes, bscially ulr paths that when called externally, 
// will delegate control to the specified script in the routers folder
app.use("/api/users", require("./app/controllers/users"));
app.use("/secure", require("./app/controllers/auth"));

// basic route
app.get('/', async (req, res) => { 
  res.send("Welcome to weStudy");
});

// Start webserver and listen for connections
app.listen(port, () => {  
  console.log(`weStudy listening at http://localhost:${port}`)
})