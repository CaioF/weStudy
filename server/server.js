// import libraries
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const sessions = require('express-session')
const authService = require("./app/services/authService");
const chatService = require("./app/services/chatService");
const path = require('path');
const root = path.normalize(__dirname + '/..');

// initialize variables
dotenv.config();
const app = express()
const port = process.env.PORT; // heroku adds PORT -->
const webRoot = path.join(root, 'web', 'build');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// initialize app (our server)
app.use(cors({
  origin : process.env.ORIGIN, 
  credentials: true, 
  allowedHeaders : 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Set-Cookie'
}));

app.use(sessions({
  secret: process.env.JWT_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(bodyParser.json());

// set up websocket
// io.on('event.here', async (data) => {
  
//   socket.on('message', async (msg) => {

//     await chatService.processMessage(msg, io);

//     // console.log("Received a chat message");
//     // io.emit('chat message', msg);
//   });

// });


io.on('connection', function(socket) {
 
  socket.on('message', async (msg) => {

    await chatService.processMessage(msg, io);

  });
})

// io.on('connection', function(socket) {
 
//   socket.on('message', function(msg) {

//     chatService.processMessage(msg, io);

//     // console.log("Received a chat message");
//     // io.emit('chat message', msg);
//   });
// })

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
app.get('/echo', async (req, res) => { 
  res.send("Welcome to weStudy");
});
app.use("/api/users", require("./app/controllers/users"));
app.use("/api/userGroups", require("./app/controllers/userGroups"));
app.use("/secure", require("./app/controllers/auth"));
app.use("/api/meta", require("./app/controllers/meta"));
app.use("/api/chat", require("./app/controllers/chat"));

// set static folder
//app.use(express.static(webRoot));

// react-router will take care of spa routing 
app.get('/', (req, res) => {
  res.sendFile(path.join(webRoot, 'index.html'))
})

// Start webserver and listen for connections
http.listen(port, () => {  
  console.log(`weStudy listening at http://localhost:${port}`)
})

