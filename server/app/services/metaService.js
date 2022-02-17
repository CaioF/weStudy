const dataService = require("./dataService");
const collectionName = "meta.subjects";

/** Get the list of subjects */
var getSubjects = async function() {    
  let subjects = await dataService.getManyAsync(collectionName, { });
  return subjects;
};

module.exports.getSubjects = getSubjects;

