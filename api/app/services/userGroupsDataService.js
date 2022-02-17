const dataService = require("./dataService");
const collectionName = "user.groups";
const momentTZ  = require("moment-timezone");
const timeZonesList = momentTZ.tz.names();
const utility = require("../utility");

var tryGetUserGroups = async function(userId) {
    
    // validate input
    if (!userId){
        return { success : false, error : "Invalid userId" };
    }

    var project = {
        _id : 1,
        ownerId : 1, 
        name: 1, 
        size : 1,
        spots : 1,
        timeZone : 1,
        timeRanges : 1,
        dateCreated: 1,
        dateUpdated: 1
    };

    let groups = await dataService.getManyAsync(collectionName, { $or : [ 
        { ownerId : userId },
        { members : { $elemMatch : { userId : userId, status : 1 } } }
     ]}, project);

    let convertedGroups = [];
    groups.payload.forEach(g => {
        convertedGroups.push(convertDocument(g));        
    }); 

    // return the users
    return { success : true, payload : convertedGroups };
};

/** Get a specific group if you are an approved member or the owner */
var tryGetGroup = async function(userId, groupId) {
    
    // validate input
    if (!userId){
        return { success : false, error : "Invalid userId" };
    }

    if (!groupId){
        return { success : false, error : "Invalid groupId" };
    }

    var project = {
        _id : 1,
        ownerId : 1, 
        name: 1, 
        size : 1,
        spots : 1,
        timeZone : 1,
        members : 1,
        timeRanges : 1,
        dateCreated: 1,
        dateUpdated: 1
    };

    let group = await dataService.getOneAsync(collectionName, { "_id" : dataService.toDbiD(groupId) }, project);
    if (!group.success){
        return { success : false, payload : `Could not find group with id ${groupId}` };
    }

    // The user cannot access the group if he is not an apporved memeber or the group owner
    if (group.payload.members.filter(x => x.userId == userId && x.status == 1).length > 0 || group.ownerId == userId){
        let convertedGroup = convertDetailedDocument(group.payload);

        // return the group
        return { success : true, payload : convertedGroup };
    }
    
    return { success : false, error : `Access to group with id ${groupId} denied` };
    
};

var createNewGroup = async function(userId, group) {
    
    // validate input    
    var errors = validateGroup(group, userId);
    if (errors.length > 0){
        return { success : false, error : errors };
    }

    var times = [];

    group.timeRanges.forEach(tz => {
        let utcStart = convertToUtcInt(tz.startTime, group.timeZone);
        let utcEnd = convertToUtcInt(tz.endTime, group.timeZone);
        times.push({ day : tz.day, utcStartTime : utcStart, utcEndTime : utcEnd });
    });  

    const update = { 
        $setOnInsert : { 
            ownerId: userId, 
            name: group.name, 
            size : group.size,
            spots : group.size,
            timeZone : group.timeZone,
            timeRanges : times,
            members : [],
            dateCreated: new Date(),
            dateUpdated: new Date() }
    }

    let document = await dataService.getOrCreateAsync(collectionName, { "ownerId" : userId, "name": group.name }, update);    
    if (!document.success){
        return { success : false, error : `Could not create a new group : ${document.error}` };
    }

    return { success : true, payload : convertDocument(document.payload) };
};

var tryUpdateGroup = async function(userId, groupId, group) {

    // first validate input    
    let errors = validateGroup(group, userId);
    if (errors.length > 0){
        return { success : false, error : errors };
    }

    let filter = { "ownerId" : userId, "_id" : dataService.toDbiD(groupId) };

    // second find the group, the user can only update his own group
    let existingGroup = await dataService.getOneAsync(collectionName, filter);
    if (!existingGroup.success){
        return { success : false, error : existingGroup.error };
    }
 
    const update = { 
        $set : { 
            ownerId: userId, 
            name: group.name, 
            subject: group.subject, 
            size : group.size,
            timeZone : group.timeZone,
            timeRanges : group.timeRanges,
            members : [],
            dateUpdated: new Date() }
     }

     let doc = await dataService.updateOneAsync(collectionName, filter, update);     
     if (!doc.success){
         return { success : false, error : `Could not update group with id '${groupId}'` };
     }

     return { success : true, payload : convertDocument(doc.payload) };
}

var deleteGroup = async function(userId, groupId) { 

    let filter = { "userId" : userId, "_id" : dataService.toDbiD(groupId) };
    let existingGroup = await dataService.deleteOneAsync(collectionName, filter);
    if (!existingGroup.success){
        return { success : false, error : existingGroup.error };
    }
 
    return { success : true };}

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
    let convertedGroups = [];
    groups.payload.forEach(g => {
        convertedGroups.push(convertDocument(g));        
    }); 

    return convertedGroups;
}

var tryRequestJoin = async function(userId, groupId) {

    if (!userId){
        return { success : false, error : `Invalid userId` };
    }

    if (!groupId){
        return { success : false, error : `Invalid groupId` };
    }

    // try to find the group
    let group = await dataService.getOneAsync(collectionName, { "_id" : dataService.toDbiD(groupId) } );
    if (!group.success){
        return { success : false, error : `Could not find group with id ${groupId}` }
    }

    if (group.payload.ownerId == userId){
        return { success : false, error : `Already joined to own group` };
    }

    if (group.payload.members.includes(x => x.userId == userId)){
        return { success : false, error : `Already joined to this group` };
    }

    if (group.payload.spots < 1){
        return { success : false, error : `Group is full` };
    }

    // update the group atomically
    const update = { 
        $inc : { spots : -1 },
        $push : { members : { userId : userId, dateRequested : new Date(), status : 0 } }
    };

    const filter = { 
        "_id" : dataService.toDbiD(groupId),
        spots : { $gte : 1 },
        ownerId : { $ne : userId },
        members : { $not: { $elemMatch : { userId : userId }}}
    };

    let groupJoin = await dataService.updateOneAsync(collectionName, filter, update, { "_id" : dataService.toDbiD(groupId)  });
    if (!groupJoin.success){
        return { success : false, error : `Unable to join group, please try again.` }; 
    }

    return  { success : true };
}

/** Convert the stored time number to string and apply the timezone
 * 150 --> 1:50
 * 1500 --> 15:00
 * 2315 --> 23:15
 */
function convertToStringTime(timeinput, timeZone){

    let min = "00";
    let hr = "00";

    if (timeinput.length > 1){
        min = timeinput.substring(Math.max(timeinput.length - 2, 1));
        hr = timeinput.replace(min, "");
        hr = hr.length == 0 ? "00" : hr;
    }
    
    let utc = momentTZ.utc(`2000-01-01 ${hr}:${min}Z`);
    let local = utc.tz(timeZone).format("HH:mm");
    return local;
}

/** We need to convert from the stored document to the api output */
function convertDocument(doc){

    let times = [];

    doc.timeRanges.forEach(tz => {
        let startTime = convertToStringTime(tz.utcStartTime.toString(), doc.timeZone);
        let entTime = convertToStringTime(tz.utcEndTime.toString(), doc.timeZone);
        times.push({ day : tz.day, startTime : startTime, entTime : entTime });
    }); 

    var returnObj = {
        ownerId : doc.ownerId,
        name: doc.name, 
        subject: doc.subject, 
        size : doc.size,
        availibleSpots : doc.spots,
        timeZone : doc.timeZone,
        timeRanges : times,
        dateCreated: doc.dateCreated,
        dateUpdated: doc.dateUpdated
    };

    return returnObj;
}

/** Similar to convertDocument, but the full payload */
function convertDetailedDocument(doc, userId){

    let converted = convertDocument(doc);
    converted["isOwner"] = userId == doc.ownerId;
    converted["members"] = doc.members;

    return converted;
}

/** Convert the input date from the given timezone to utc */
function convertToUtcInt(timeinput, timeZone){

    /* 
        I had some issues using the library, 
        no matter what it seemed to always take the input as UTC and then applying the timezone
        As a solution, I get the timezone offset and then manually build the ISO string, 
        then create the moment object, which I can then convert to UTC
    */
    let offSet = momentTZ().tz(timeZone).format('ZZ');

    // The date here is irrelevant as we only need the time
    let utc = momentTZ.utc(`2000-01-01 ${timeinput}${offSet}`);
    let hm = utc.format("HHmm");
    return parseInt(hm);
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

            // convert and check start time
            var start = parseInt(group.timeRanges[i].startTime.replace(":", ""));
            if (!start){
                errors.push("Invalid startTime in timeRange element " + i);
            }

            if (start < 0 || start > 2359){
                errors.push("Invalid startTime in timeRange element " + i + ". Times has to be in the range of 0 - 2359");
            }

            // convert and check end time
            var end = parseInt(group.timeRanges[i].endTime.replace(":", ""));
            if (!end){
                errors.push("Invalid endTime in timeRange element " + i);
            }

            if (end < 0 || end > 2359){
                errors.push("Invalid endTime in timeRange element " + i + ". Times has to be in the range of 0 - 2359");
            }

            if (start > end){
                errors.push("Invalid endTime in timeRange element " + i + ", endtime has to be greater than startTime");
            }

            // group.timeRanges[i].convertedStartTime = convertTime(group.timeRanges[i].startTime);   
            // if (group.timeRanges[i].convertedStartTime.timeNumber < 0 || group.timeRanges[i].convertedStartTime.timeNumber > 2359){
            //     errors.push("Invalid startTime in timeRange element " + i + ". Times has to be in the range of 0 - 2359");
            // }

            //  // convert and check end time
            //  group.timeRanges[i].convertedEndTime = convertTime(group.timeRanges[i].endTime);
            // if (group.timeRanges[i].convertedEndTime.timeNumber < 0 || group.timeRanges[i].convertedEndTime.timeNumber > 2359){
            //     errors.push("Invalid endTime in timeRange element " + i + ". Times has to be in the range of 0 - 2359");
            // }
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
module.exports.tryRequestJoin = tryRequestJoin;
module.exports.tryGetGroup = tryGetGroup;