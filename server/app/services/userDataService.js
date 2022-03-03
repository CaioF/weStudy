var dataService = require('./dataService');
const collectionName = 'user.accounts';

var tryGetUserByEmail = async function (userEmail) {
  // validate input
  if (!userEmail) {
    return { success: false, error: 'Invalid email address' };
  }

  const result = await dataService.getOneAsync(collectionName, {
    email: userEmail,
  });

  if (!result.success && result.code == 'NOT_FOUND') {
    return {
      success: false,
      error: "User with email '" + userEmail + "' not found",
    };
  }

  // return the user
  return result;
};

var tryGetUserById = async function (userId) {
  // validate input
  if (!userId) {
    return { success: false, error: 'Invalid email address' };
  }

  const result = await dataService.getOneAsync(collectionName, {
    _id: dataService.toDbiD(userId),
  });

  if (!result.success && result.code == 'NOT_FOUND') {
    return {
      success: false,
      error: "User with id '" + userId + "' not found",
    };
  }

  // return the user
  return result;
};

var tryGetUsersById = async function (userIds) {
  // validate input
  if (!userIds) {
    return { success: false, error: 'Invalid user ids' };
  }

  for (let i = 0; i < userIds.length; i++) {
    userIds[i] = dataService.toDbiD(userIds[i]);    
  }

  let filter = { _id : { $in : userIds } };

  const result = await dataService.getManyAsync(collectionName, filter);

  if (!result.success && result.code == 'NOT_FOUND') {
    return {
      success: false,
      error: "No users found",
    };
  }

  // return the users
  return result;
};

async function tryGetOrCreateUser(userDetails) {
  const update = {
    $setOnInsert: {
      email: userDetails.email,
      firstName: userDetails.given_name,
      lastName: userDetails.family_name,
      dateCreated: new Date(),
    },
  };

  return await dataService.getOrCreateAsync(
    collectionName,
    { email: userDetails.email },
    update
  );
}

// async function tryUpdateUser(userId, user) {
//   // validate input
//   if (!userId) {
//     return { success: false, error: 'Invalid userId' };
//   }
//   if (!user.email) {
//     return { success: false, error: 'Invalid email' };
//   }
//   if (!user.firstName) {
//     return { success: false, error: 'Invalid first name' };
//   }
//   if (!user.lastName) {
//     return { success: false, error: 'Invalid last name' };
//   }

//   let filter = { userId: userId, _id: dataService.toDbiD(userId) };

//   let existingUser = await dataService.getOneAsync(collectionName, filter);
//   if (!existingUser.success) {
//     return { success: false, error: existingUser.error };
//   }
//   const update = {
//     $setOnInsert: {
//       email: user.email,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       dateCreated: user.dateCreated,
//       dateUpdated: '2022-01-29T18:25:43.511Z',
//     },
//   };

//   return await dataService.updateOneAsync(collectionName, filter, update);
// }

var tryDeleteUser = async function (userId) {
  let filter = { userId: userId, _id: dataService.toDbiD(userId) };
  let deleteUser = await dataService.deleteOneAsync(collectionName, filter);
  if (!deleteUser.success) {
    return { success: false, error: deleteUser.error };
  }

  return { success: true };
};

var tryRateUser = async function (userId, targetUserId, rating) {

  if (!userId){
    return { success : false, error : "Invalid userId" };
  }

  if (!targetUserId){
    return { success : false, error : "Invalid targetUserId" };
  }

  if (!rating){
    return { success : false, error : "Invalid rating" };
  }

  rating = parseInt(rating);

  if (!Number.isInteger(rating)){
    return { success : false, error : "Invalid rating, only numbers are allowed" };
  }

  if (rating < 0 || rating > 5){
    return { success : false, error : "Invalid rating, should be in the range 0-5" };
  }

  // confirm that the user exists 
  let targetUser = await tryGetUserById(targetUserId);
  if (!targetUser.success) {
    return { success: false, error: targetUser.error };
  }

  let filter = { _id : dataService.toDbiD(targetUserId) };

  const removeRating = {
    $pull: {
      'ratings': {
          "userId": userId
      }
    }
  };

  var tryPull = await dataService.updateOneAsync(collectionName, filter, removeRating);
  if (!tryPull.success){
    return { success : false, error : tryPull.error };
  }

  const update = {
    $push : { ratings : { 
      userId : userId,  
      rating : rating,
      dateCreated : new Date() 
    }}
  };

  return await dataService.updateOneAsync(collectionName, filter, update);
};

module.exports.tryGetUserByEmail = tryGetUserByEmail;
module.exports.tryGetUserById = tryGetUserById;
module.exports.tryGetUsersById = tryGetUsersById;
module.exports.tryGetOrCreateUser = tryGetOrCreateUser;
module.exports.tryDeleteUser = tryDeleteUser;
module.exports.tryRateUser = tryRateUser;
