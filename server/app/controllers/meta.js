const express = require("express");
const momentTZ  = require("moment-timezone");

const router = express.Router();

router.get("/timeZones", async function (req, res) {
    res.json(momentTZ.tz.names());    
});

router.get("/topics", async function (req, res) {  
});

router.post("/timeZones", async function (req, res) {
    var a = momentTZ.tz(req.body.utc, req.body.zone).format();
    res.json(a);    
});

module.exports = router;


