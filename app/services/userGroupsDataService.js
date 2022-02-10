const dataService = require("./dataService");
const collectionName = "user.groups";
const momentTZ  = require("moment-timezone");
const timeZonesList = momentTZ.tz.names();
const utility = require("../utility");

// TODO:Times to be converted to UTC before saving

var tryGetUserGroups = async function(userId) {
    
    // validate input
    if (!userId){
        return { success : false, error : "Invalid userId" };
    }

    //TODO:CO::Update query to include groups I have joined (contained in members)
    let groups = await dataService.getManyAsync(collectionName, { "userId" : userId } );

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
            spots : group.size,
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
             subject: group.subject, 
             size : group.size,
             timeZone : group.timeZone,
             timeRanges : group.timeRanges,
             members : [],
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

var searchGroup = async function(searchRequest) {
    
    // first validate input    
    let errors = validateSearchRequest(searchRequest);
    if (errors.length > 0){
        return { success : false, error : errors };
    }

    /*
    db.getCollection('user.groups').find({ timeRanges : { $elemMatch  : {
        day : "Monday",
        startTime : { $lte : 1300 },
        endTime : { $gte : 1400 },
    }
    }, spots : { $gte : 1 } })

    db.getCollection('user.groups').find({subject:{'$regex' : 'math', '$options' : 'i'}})
    */

    let groupSizeRange = Math.max(1, searchRequest.groupSize * 0.15);
    let groupSizeMax = searchRequest.groupSize + groupSizeRange;
    let groupSizeMin = Math.max(searchRequest.groupSize - groupSizeRange, 1);
    
    let filter = { 
        "timeRanges" : {  $elemMatch: {
            "day" : searchRequest.day, 
            "startTime" : { $lte : searchRequest.startTime },
            "endTime" : { $gte : searchRequest.endTime },
        }},
        "spots" : {  $gte : 1 },
        'subject': {'$regex':  searchRequest.subject, '$options' : 'i'},
        "size" : { $lte : groupSizeMax },
        "size" : { $gte : groupSizeMin },
        //TODO: Add group size preferred range
    };

    let groups = await dataService.getManyAsync(collectionName, filter );

    return groups;
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

    // for now we will allow free form subjects
    if (!group.subject){
        errors.push("Invalid subject");
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

function validateSearchRequest(request){
    var errors = [];
    if (!request){
        errors.push("Invalid search request");
    }

    if (!request.groupSize || !Number.isInteger(request.groupSize)){
        errors.push("Invalid groupSize");
    }

    if (!request.startTime|| !Number.isInteger(request.startTime)){
        errors.push("Invalid startTime");
    }
  
    if (!request.endTime|| !Number.isInteger(request.endTime)){
        errors.push("Invalid endTime");
    }

    if (request.startTime > request.endTime){
        errors.push("Invalid time range, start needs to be less than end");
    }

    return errors;
}

module.exports.tryGetUserGroups = tryGetUserGroups;
module.exports.createNewGroup = createNewGroup;
module.exports.tryUpdateGroup = tryUpdateGroup;
module.exports.deleteGroup = deleteGroup;
module.exports.searchGroup = searchGroup;