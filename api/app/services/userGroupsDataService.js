const dataService = require("./dataService");
const collectionName = "user.groups";
const momentTZ  = require("moment-timezone");
const timeZonesList = momentTZ.tz.names();
const utility = require("../utility");

// for now we will just mock the data

var tryGetUserGroups = async function(userId) {
    
    // validate input
    if (!userId){
        return { success : false, error : "Invalid userId" };
    }

    let groups = await dataService.getManyAsync(collectionName, { "userId" : userId});

    // return the user 
    return { success : true, payload : groups.payload };
};

var createNewGroup = async function(userId, group) {
    
    // validate input    
    var errors = validateGroup(group, userId);
    if (errors.length > 0){
        return { success : false, error : errors };
    }

    const update = { 
        $setOnInsert : { 
            userId: userId, 
            name: group.name, 
            size : group.size,
            timeZone : group.timeZone,
            timeRanges : group.timeRanges,
            dateCreated: new Date(),
            dateUpdated: new Date() }
    }
    
    return await dataService.getOrCreateAsync(collectionName, { "userId" : userId, "name": group.name }, update); 
};

var tryUpdateGroup = async function(userId, groupId, group) {

    // first validate input    
    let errors = validateGroup(group, userId);
    if (errors.length > 0){
        return { success : false, error : errors };
    }

    let filter = { "userId" : userId, "_id" : dataService.toDbiD(groupId) };

    // second find the group, the user can only update his own group
    let existingGroup = await dataService.getOneAsync(collectionName, filter);
    if (!existingGroup.success){
        return { success : false, error : existingGroup.error };
    }
 
     const update = { 
         $set : { 
             userId: userId, 
             name: group.name, 
             size : group.size,
             timeZone : group.timeZone,
             timeRanges : group.timeRanges,
             dateUpdated: new Date() }
     }
     
     return await dataService.updateOneAsync(collectionName, filter, update); 
}

var deleteGroup = async function(userId, groupId) { 

    let filter = { "userId" : userId, "_id" : dataService.toDbiD(groupId) };
    let existingGroup = await dataService.deleteOneAsync(collectionName, filter);
    if (!existingGroup.success){
        return { success : false, error : existingGroup.error };
    }
 
    return { success : true };
}

function validateGroup(group, userId){
    var errors = [];
    if (!userId){
        errors.push("Invalid userId");
    }

    if (!group){
        errors.push("Invalid group");
    }
    
    if (!group.name){
        errors.push("Invalid group name");
    }
        
    if (!group.size || group.size < 2){
        errors.push("Invalid group size specified");
    }

    if (!group.timeZone){
        errors.push("Invalid group timeZone specified");
    }
    else if (!timeZonesList.find(x => x == group.timeZone)){
        errors.push("Invalid group timeZone specified, check the meta to get the correct timezone");
    }

    //TODO:CO:: we need to specify the time/date
    if (!group.timeRanges){
        errors.push("Invalid group timeRanges specified");
    }
    else{
        for (let i = 0; i < group.timeRanges.length; i++) {
            
            if (!utility.Days.find(x => x ==  group.timeRanges[i].day)){
                errors.push("Invalid day in timeRange element " + i);
            }

            if (group.timeRanges[i].startTime < 0 || group.timeRanges[i].startTime > 2359){
                errors.push("Invalid startTime in timeRange element " + i + ". Times has to be in the range of 0 - 2359");
            }

            if (group.timeRanges[i].endTime < 0 || group.timeRanges[i].endTime > 2359){
                errors.push("Invalid endTime in timeRange element " + i + ". Times has to be in the range of 0 - 2359");
            }
        }
    }

    return errors;
}


module.exports.tryGetUserGroups = tryGetUserGroups;
module.exports.createNewGroup = createNewGroup;
module.exports.tryUpdateGroup = tryUpdateGroup;
module.exports.deleteGroup = deleteGroup;