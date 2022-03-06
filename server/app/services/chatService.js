const userGroupDs = require("../services/userGroupsDataService");
const userDs = require("../services/userDataService");
const dataService = require("./dataService");
const collectionName = "group.chat";

async function processMessage(msg, sessionID, io){

    let time = new Date();

    if(!msg.groupId){
        console.log(`ERROR : invalid group id`);
        return;
    }

    if(!msg.message){
        console.log(`ERROR : empty message from client`);
        return;
    }

    if(!msg.userId){
        console.log(`ERROR : invalid userId`);
        return;
    }

    try{

        // lookup user
        var tryGetUser = await userDs.tryGetUserById(msg.userId);
        if (!tryGetUser.success){
            console.log(`ERROR : cannot get user : ${tryGetUser.error}`);
            return;
        }
        
        // lookup group
        // var tryGetGroup = await userGroupDs.tryGetGroup(msg.userId, msg.groupId);
        // if (!tryGetGroup.success){
        //     console.log(`ERROR : cannot get group : ${tryGetGroup.error}`);
        //     return;
        // }

        let chatMessage = { 
            groupId : msg.groupId,
            time : time, 
            userId : msg.userId, 
            user : tryGetUser.payload.firstName, 
            message : msg.message 
        };

        // store the messages, should we buffer?
        let trySave = await trySaveChat(chatMessage);
        if (!trySave.success){
            console.log(`ERROR : ${trySave.error}`);
        }
      
        // let chatId = `m:${tryGetGroup.payload.chatId}`;
        io.to(sessionID).emit('getMessage', chatMessage);
    }
    catch(ex){
        console.log(`ERROR : ${ex.message}`);
    }

}

async function trySaveChat(chatMessage) {     
 
    let document = await dataService.insertOneAsync(collectionName, chatMessage);    
    if (!document.success){
        return { success : false, error : `Could not save chat : ${document.error}` };
    }

    return { success : true };
}


async function getChatHistory(groupId) {    
    
    let project = {
        _id : 1,
        groupId : 1, 
        time: 1, 
        userId : 1,
        user : 1,
        message : 1,
    };

    // let documents = await dataService.getManyPaginatedAsync(collectionName, {}, {},  page, 50, { time : -1 });    
    let documents = await dataService.getManyAsync(collectionName, {}, project, { time : -1 });

    if (!documents.success){
        return { success : false, error : `Could not read chat history : ${documents.error}` };
    }

    return { success : true, payload : documents.payload };
}

module.exports.processMessage = processMessage;
module.exports.getChatHistory = getChatHistory;
