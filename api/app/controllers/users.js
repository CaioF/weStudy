var express = require("express");
var dataService = require("../services/userDataService");

const router = express.Router();

// Setup GET methods
/*************** GET ***************/

router.get("/userDetails", function (req, res) {

    dataService.tryGetUserById(req.session.userId, function(result){
        if (result.success){
            res.send(result.payload);
        }
        else{
            res.status(500).send(result.error);
        }
    }); 
    
});

module.exports = router;