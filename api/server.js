// import libraries
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv');

// initialize variables
dotenv.config();
const app = express()
var port = process.env.serverPort;

// initialize app (our server)
app.use(cors())
app.use(bodyParser.json());


// configure routes, bscially ulr paths that when called externally, 
// will delegate control to the specified script in the routers folder
app.use("/api/users", require("./app/routers/users"));
app.use("/api/auth", require("./app/routers/auth"));

// basic route
app.get('/', async (req, res) => { 
  res.send("Welcome to weStudy");
});

// Start webserver and listen for connections
app.listen(port, () => {  
  console.log(`weStudy listening at http://localhost:${port}`)
})