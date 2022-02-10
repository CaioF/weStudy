var dataService = require("./dataService");
const collectionName = "user.accounts";

// for now we will just mock the data

var tryGetUserByEmail = async function(userEmail) {
    
    // validate input
    if (!userEmail){
        return { success : false, error : "Invalid email address" };
    }

    const result = await dataService.getOneAsync(collectionName, { "email" : userEmail }); 

    if (!result.success && result.code == "NOT_FOUND"){
        return { success : false, error : "User with email '" + userEmail + "' not found" };
    }

    // return the user 
    return result;
};

var tryGetUserById = async function(userId) {
    
    // validate input
    if (!userId){
        return { success : false, error : "Invalid email address" };
    }

    // we need to lookup this user from the DB
    var user = {
        "id" : userId,
        "email" : "someEmail",
        "firstName" : "UserFirstName",
        "lastName" : "UserLastName",
        "dateCreated" : "2022-01-29T18:25:43.511Z",        
    };

    // return the user 
    return { success : true, payload : user };
};

async function tryGetOrCreateUser(userDetails){

    const update = { 
        $setOnInsert : { 
            email: userDetails.email, 
            firstName: userDetails.given_name, 
            lastName: userDetails.family_name, 
            dateCreated: new Date()  }
    }
    
    return await dataService.getOrCreateAsync(collectionName, { "email" : userDetails.email }, update); 
}

module.exports.tryGetUserByEmail = tryGetUserByEmail;
module.exports.tryGetUserById = tryGetUserById;
module.exports.tryGetOrCreateUser = tryGetOrCreateUser;