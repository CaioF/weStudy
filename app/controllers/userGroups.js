var express = require("express");
var dataService = require("../services/userGroupsDataService");

const router = express.Router();

/*************** GET ***************/

/** Get current authenticated user's groups */
router.get("/", async function (req, res) {

    const result = await dataService.tryGetUserGroups(req.session.userId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** Get a specific group */
router.get("/:groupId", async function (req, res) {

    const result = await dataService.tryGetGroup(req.session.userId, req.params.groupId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** Create a new group */
router.post("/", async function (req, res) {

    const result = await dataService.createNewGroup(req.session.userId, req.body); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** search for group */
router.post("/find", async function (req, res) {

    const result = await dataService.searchGroup(req.body); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** update group */
router.put("/:groupId", async function (req, res) {

    const result = await dataService.tryUpdateGroup(req.session.userId, req.params.groupId, req.body); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** request to join a group */
router.post("/:groupId/join", async function (req, res) {

    const result = await dataService.tryRequestJoin(req.session.userId, req.params.groupId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});


/** delete group */
router.delete("/:groupId", async function (req, res) {

    const result = await dataService.deleteGroup(req.session.userId, req.params.groupId); 
    if (result.success){
        res.send();
    }
    else{
        res.status(400).json(result.error);
    }    
});


module.exports = router;