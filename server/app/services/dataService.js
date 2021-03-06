const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

/** Read single records from db */
async function getOneAsync(collectionName, filter, project) {

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    try {              
        // cast object
        if (!project){
            project = {};
        }  

        let res = await collection.payload.findOne(filter, project);
        if (!res){
            return { success : false, error : "Not found", code : "NOT_FOUND" };    
        }

        return { success : true, payload : setObjectId(res) };
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}

async function aggregateOneAsync(collectionName, aggregation) {

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    try {   

        let res = await collection.payload.aggregate(aggregation).toArray();
        if (!res){
            return { success : false, error : "Not found", code : "NOT_FOUND" };    
        }

        if (res.length == 0){
            return { success : false, error : "Not found", code : "NOT_FOUND" };    
        }

        return { success : true, payload : setObjectId(res[0]) };
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}

async function aggregateManyAsync(collectionName, aggregation) {

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    try {   

        let res = await collection.payload.aggregate(aggregation).toArray();
        if (!res){
            return { success : false, error : "Not found", code : "NOT_FOUND" };    
        }

        res.forEach(element => {
            element = setObjectId(element)
        });        

        return { success : true, payload : res };
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}


/** Read collection from db */
async function getManyAsync(collectionName, filter, project, sort) {

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    try {

        if (!project){
            project = {};
        }
        
        if (!sort){
            sort = {};
        }

        let res = await collection.payload.find(filter, project).sort(sort).toArray();
        res.forEach(element => {
            element = setObjectId(element)
        });
        return { success : true, payload : res };
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}

/** Read collection from db */
async function getManyPaginatedAsync(collectionName, filter, project, page, itemsPerPage, sort) {

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    try {

        if (!project){ project = {}; }  
        if (!sort){ sort = {}; }  

        let res = await collection.payload.find(filter, project)
                                            .skip( page > 0 ? ( ( page - 1 ) * itemsPerPage ) : 0 )
                                            .limit( itemsPerPage )
                                            .sort(sort)
                                            .toArray();
        res.forEach(element => {
            element = setObjectId(element)
        });
        return { success : true, payload : res };
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}

async function insertOneAsync(collectionName, document, project) {

    if (!collectionName){
        return { success : false, error : "invalid collectionName" };
    }

    if (!document){
        return { success : false, error : "invalid document supplied" };
    }

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    if (!project){
        project = {};
    } 

    try {

        let res = await collection.payload.insertOne(document);
        if (res.insertedId){
            return { success : true, payload : setObjectId(document) };
        }
        else{
            return { success : false, error : "Could not insert" };
        }
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}

/** Upsert a document if it does not exists */
async function getOrCreateAsync(collectionName, filter, update) {

    if (!filter){
        return { success : false, error : "invalid filter supplied" };
    }

    if (!update){
        return { success : false, error : "invalid update supplied" };
    }

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    try {

        let res = await collection.payload.updateOne(filter, update, { upsert: true });

        if (!res.acknowledged){
            // the query failed
            return { success : false, error : "Could not get or create record" };
        }

        let record = null;

        if (res.upsertedId){
            record = await collection.payload.findOne({ _id : res.upsertedId }, {});
        }
        else{
            record = await collection.payload.findOne(filter, {});
        }

        if (!record){
            // could not find the new or old record, something went wrong
            return { success : false, error : "Could not get or create record" };
        }

        return { success : true, payload : setObjectId(record) };
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}

async function updateOneAsync(collectionName, filter, update, postUpdateFilter) {

    if (!filter){
        return { success : false, error : "invalid filter supplied" };
    }

    if (!update){
        return { success : false, error : "invalid update supplied" };
    }

    if (!postUpdateFilter){
        postUpdateFilter = filter;
    }

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    try {

        let res = await collection.payload.updateOne(filter, update, { upsert: false });

        if (!res.acknowledged || res.modifiedCount == 0){
            // the query failed
            return { success : false, error : "Could not get or update record" };
        }

        let record = await collection.payload.findOne(postUpdateFilter, {});       

        if (!record){
            // could not find the new or old record, something went wrong
            return { success : false, error : "Could not get or create record" };
        }

        return { success : true, payload : setObjectId(record) };
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}

async function deleteOneAsync(collectionName, filter) {

    if (!filter){
        return { success : false, error : "invalid filter supplied" };
    }

    var collection = await tryGetCollection(collectionName);
    if (!collection.success){
        return collection;
    }

    try {

        let res = await collection.payload.deleteOne(filter);

        if (!res.acknowledged || res.deletedCount == 0){
            return { success : false, error : "Could not delete record" };
        }

        return { success : true };
    } 
    catch (err) {
        return { success : false, error : err.message };
    }
}

async function tryGetCollection(collectionName){

    if (!collectionName){
        return { success : false, error : "Invalid collection name" };
    }

    // note to self, local connection was failing untill I changed the replicaSet host to the IP used in the connection
    const client = await MongoClient.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => { return { success : false, error : err.message } });

    if (!client) {
        return { success : false, error : "Could not create db client" };
    }

    let db = client.db(process.env.dbName);
    let collection = db.collection(collectionName);

    return { success : true, payload : collection };
}

function setObjectId(obj){
    if (obj){
        obj.id = obj._id.toString();
        delete obj._id;        
    }  
    return obj;  
}

var toDbiD = function(inputId) {    
    try{
        return new mongo.ObjectID(inputId);    
    }
    catch(ex){
        return null; 
    }  
}

module.exports.getOneAsync = getOneAsync;
module.exports.getManyAsync = getManyAsync;
module.exports.getManyPaginatedAsync = getManyPaginatedAsync;
module.exports.insertOneAsync = insertOneAsync; 
module.exports.getOrCreateAsync = getOrCreateAsync;
module.exports.updateOneAsync = updateOneAsync;
module.exports.deleteOneAsync = deleteOneAsync;
module.exports.aggregateOneAsync = aggregateOneAsync;
module.exports.aggregateManyAsync = aggregateManyAsync;
module.exports.toDbiD = toDbiD;
