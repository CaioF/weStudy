// import libraries
const express = require("express");
const router = express.Router();
const chatService = require("../services/chatService");

router.get("/:groupId", async function (req, res) {

  let page = !req.query.page ? 1 : req.query.page;
  const result = await chatService.getChatHistory(req.session.userId, req.params.groupId, page); 
  if (result.success){
      res.json(result.payload);
  }
  else{
      res.status(400).json(result.error);
  }     
});

module.exports = router;
