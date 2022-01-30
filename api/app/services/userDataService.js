var dataService = require("./dataService");

// for now we will just mock the data

var tryGetUserByEmail = async function(email) {
    
    // validate input
    if (!email){
        return { success : false, error : "Invalid email address" };
    }

    // we need to lookup this user from the DB
    var user = {
        "id" : "SomeUserId",
        "email" : email,
        "firstName" : "UserFirstName",
        "lastName" : "UserLastName",
        "dateCreated" : "2022-01-29T18:25:43.511Z",        
    };

    // return the user 
    return { success : true, payload : user };
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

module.exports.tryGetUserByEmail = tryGetUserByEmail;
module.exports.tryGetUserById = tryGetUserById;