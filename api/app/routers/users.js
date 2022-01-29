var express = require("express");
var dataService = require("../data/userDataService");

const router = express.Router();

// Setup GET methods
/*************** GET ***************/
/** Get user by email address */
router.get("/:userEmail", function (req, res) {

    dataService.getUserByEmail(req.params.userEmail, function(result){
        if (result.success){
            res.send(result.payload);
        }
        else{
            res.status(500).send(result.error);
        }
    }); 
    
});


module.exports = router;