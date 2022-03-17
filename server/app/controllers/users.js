var express = require("express");
var dataService = require("../services/userDataService");

const router = express.Router();

// Setup GET methods
/*************** GET ***************/

/** Return current logged in user */
router.get("/", async function (req, res) {

    const result = await dataService.tryGetUserById(req.session.userId); 
    if (result.success){
        res.send(result.payload);
    }
    else{
        res.status(500).send(result.error);
    }    
});

/** Get user by email */
router.get("/:email", async function (req, res) {

    const result = await dataService.tryGetUserByEmail(req.params.email); 
    if (result.success){
        res.send(result.payload);
    }
    else{
        res.status(500).send(result.error);
    }    
});

/** Delete current logged in user */
router.delete("/", async function (req, res) {

    const result = await dataService.tryDeleteUser(req.session.userId); 
    if (result.success){
        res.send();
    }
    else{
        res.status(500).send(result.error);
    }    
});

/** Rate a user */
//api/user/user1/1
router.post("/:targetUserId/:rating", async function (req, res) {

    const result = await dataService.tryRateUser(req.session.userId, req.params.targetUserId, req.params.rating); 
    if (result.success){
        res.send(result.payload);
    }
    else{
        res.status(500).send(result.error);
    }    
});


module.exports = router;