const express = require("express");
const momentTZ  = require("moment-timezone");

const router = express.Router();

router.get("/timeZones", async function (req, res) {
    //const defaultTimeZone = momentTZ.tz.guess(); 
    res.json(timeZonesList);    
});

router.get("/topics", async function (req, res) {
    //const defaultTimeZone = momentTZ.tz.guess(); 
    res.json(timeZonesList);    
});

router.post("/timeZones", async function (req, res) {
    var a = momentTZ.tz(req.body.utc, req.body.zone).format();
    res.json(a);    
});

module.exports = router;


