var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = require('assert');
chai.use(chaiHttp);
const app = require('../../server');
const { doesNotMatch } = require('assert');
const { MongoMemoryServer } = require('mongodb-memory-server');
const req = require('express/lib/request');

process.env.NODE_ENV = 'test'

describe('Test /api/UserGroups', () => {

    let mongoServer;
    let testGroupId;

    before(async () => {
        mongoServer = await createMongoServer();
    });
    
    after(async () => {
        await mongoServer.stop();
    });

    it('can create user group', async () => {

        const gp = {
            "name" : "test-group",
            "description" : "this is a real study group",
            "size" : 3,
            "timeZone" : "Singapore",
            "timeRanges" : [
                { "day" : "Sunday", "startTime" : "13:00", "endTime" : "15:20" }
            ],
            "subject" : "Math"
        }

        const res = await chai.request(app).post('/api/UserGroups').send(gp);
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.have.property("id");

        testGroupId = res.body.id;
    });

    it('can get user groups', async () => {

        const res = await chai.request(app).get('/api/UserGroups');
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.be.an('array');
    });
 
});

describe('Test /api/UserGroups/{groupId}', () => {
    
    let mongoServer;    
    let testGroupId;

    before(async () => {
        mongoServer = await createMongoServer();
        testGroupId = await createTestRecord();
    });
    
    after(async () => {
        await mongoServer.stop();
    });

    it('can get specific group', async () => {

        chai.expect(testGroupId).to.not.equal(undefined);

        const res = await chai.request(app).get(`/api/UserGroups/${testGroupId}`);
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.have.property("id");
    });

    it('can update a group', async () => {        

        chai.expect(testGroupId).to.not.equal(undefined);

        let randomName = "TEST-GROUP" + makeid(5)

        let req =  {            
            "name" : randomName,
            "subject" : "other",
            "size" : 2222,
            "timeZone" : "UTC",
            "timeRanges" : [
                { "day" : "Monday", "startTime" : "9:00", "endTime" : "15:00" }
            ]
        };

        const res = await chai.request(app).put(`/api/UserGroups/${testGroupId}`).send(req);
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.have.property("name").that.equals(randomName);
    });

});

describe('Test /api/UserGroups/{groupId}/link', () => {

    let mongoServer;    
    let testGroupId;
    let link;

    before(async () => {
        mongoServer = await createMongoServer();
        testGroupId = await createTestRecord();
    });

    after(async () => {
        await mongoServer.stop();
    });

    it('can get group link', async () => {

        chai.expect(testGroupId).to.not.equal(undefined);

        const res = await chai.request(app).get(`/api/UserGroups/${testGroupId}/link`);
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.not.equal(undefined);

        // we will need to remove the url from the link for the test to work        
        link = res.body;
        link = link.replace(process.env.ORIGIN, "");
    });

    it('can join with link', async () => {

        chai.expect(testGroupId).to.not.equal(undefined);
        chai.expect(link).to.not.equal(undefined);

        const res = await chai.request(app).post(link).set('test_user', 'UNIT_TEST_3');
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.not.equal(undefined);
    });

});

describe('Test /api/UserGroups/{groupId}/RequestJoin', () => {

    let mongoServer;    
    let testGroupId;

    before(async () => {
        mongoServer = await createMongoServer();
        testGroupId = await createTestRecord();
    });

    after(async () => {
        await mongoServer.stop();
    });

    it('can request to join a group', async () => {
        chai.expect(testGroupId).to.not.equal(undefined);
        const res = await chai.request(app).post(`/api/UserGroups/${testGroupId}/RequestJoin`).set('test_user', 'UNIT_TEST_2');
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.not.equal(undefined);
    });
});

describe('Test /api/UserGroups/find', () => {

    before(async () => {
        mongoServer = await createMongoServer();
        testGroupId = await createTestRecord();
    });

    after(async () => {
        await mongoServer.stop();
    });

    it('can find a group', async () => {        

        let req =  {
            "day" : "Monday",
            "startTime" : 500,
            "endTime" : 720,
            "subject" : "maths",
            "groupSize" : 3
        };

        const res = await chai.request(app).post(`/api/UserGroups/find`).send(req);
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.be.an('array');
        chai.expect(res.body).to.not.equal(undefined);
    });
});

async function createMongoServer(){
    var mongoServer = new MongoMemoryServer();
    let mongod = await MongoMemoryServer.create();
    process.env.DB_CONNECTION = mongod.getUri();   

    return mongoServer;
}

async function createTestRecord(){
    // create test record
    const gp = {
        "name" : "test-group",
        "description" : "this is a real study group",
        "size" : 3,
        "timeZone" : "Singapore",
        "timeRanges" : [
            { "day" : "Sunday", "startTime" : "13:00", "endTime" : "15:20" }
        ],
        "subject" : "Math"
    }

    const res = await chai.request(app).post('/api/UserGroups').send(gp);
    return res.body.id;
}


// taken from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}



