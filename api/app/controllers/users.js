var express = require("express");
var dataService = require("../services/userDataService");

const router = express.Router();

// Setup GET methods
/*************** GET ***************/

router.get("/userDetails", async function (req, res) {

    const result = await dataService.tryGetUserById(req.session.userId); 
    if (result.success){
        res.send(result.payload);
    }
    else{
        res.status(500).send(result.error);
    }
    
});

module.exports = router;