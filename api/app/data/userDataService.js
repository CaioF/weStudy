var dataService = require("./data");

// for now we will just mock the data

var getUserByEmail = function(email, callack) {
    
    // validate input
    if (!email){
        return callack({ success : false, error : "Invalid email address" });
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
    callack({ success : true, payload : user });
};


module.exports.getUserByEmail = getUserByEmail;