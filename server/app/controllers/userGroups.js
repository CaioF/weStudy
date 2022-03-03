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

/** Get a direct join link for the user */
router.get("/:groupId/link", async function (req, res) {

    const result = await dataService.tryGetGroupLink(req.session.userId, req.params.groupId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** Delete a group */
router.delete("/:groupId", async function (req, res) {

    const result = await dataService.tryDeleteGroup(req.session.userId, req.params.groupId); 
    if (result.success){
        res.send();
    }
    else{
        res.status(500).send(result.error);
    }    
});

/** Create a new group */
router.post("/", async function (req, res) {

    const result = await dataService.tryCreateNewGroup(req.session.userId, req.body); 
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
router.post("/:groupId/RequestJoin", async function (req, res) {

    const result = await dataService.tryRequestJoin(req.session.userId, req.params.groupId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** request to join a group */
router.post("/:groupId/joinWithlink/:linkId", async function (req, res) {

    const result = await dataService.tryJoinWithLink(req.session.userId, req.params.groupId, req.params.linkId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** Approve request to join a group */
router.post("/:groupId/approve/:requestUserId", async function (req, res) {

    const result = await dataService.tryApproveUserRequest(req.session.userId, req.params.groupId, req.params.requestUserId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** Kick a user from the group */
router.post("/:groupId/kick/:requestUserId", async function (req, res) {

    const result = await dataService.tryKickUser(req.session.userId, req.params.groupId, req.params.requestUserId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** Create a new task */
router.post("/:groupId/tasks", async function (req, res) {

    const result = await dataService.tryCreateTask(req.session.userId, req.params.groupId, req.body); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** assign a task to a user */
router.post("/:groupId/tasks/:taskId/assign/:targetUserId", async function (req, res) {

    const result = await dataService.tryAssignTask(req.session.userId, req.params.groupId, req.params.taskId, req.params.targetUserId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});

/** Update task as completed */
router.post("/:groupId/tasks/:taskId/complete", async function (req, res) {

    const result = await dataService.tryCompleteTask(req.session.userId, req.params.groupId, req.params.taskId); 
    if (result.success){
        res.json(result.payload);
    }
    else{
        res.status(400).json(result.error);
    }    
});


module.exports = router;