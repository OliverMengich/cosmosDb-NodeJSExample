const CosmosClient = require ('@azure/cosmos').CosmosClient;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const config = require('./config');
const dbContext = require('./data/databaseContext');
require('dotenv').config();
const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });
app.use(bodyParser.urlencoded({ extended: false }));
(async(callback)=>{
    const database = client.database(databaseId);
    const container = database.container(containerId);
    // Make sure Tasks database is already setup. If not, create it.
    await dbContext.create(client, databaseId, containerId);
    callback();
})(()=>{
    app.listen(8081,(err,res)=>{
        console.log('Server runiing at pot 8081')
        if(err){
            console.log('Please conenct to internet')
        }
    });
})
app.get('/',(req,res)=>{
    res.send('<h1>I am running</h1>')
})
app.get('/add-user',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})
app.post('/add-user', async (req,res)=>{
    const database = client.database(databaseId);
    const container = database.container(containerId);
    console.log(req.body)
    const newUser = {
        name: req.body.name,
        email:req.body.email,
        password: req.body.password
    };
    await container.items.create(newUser).then(result=>{
        //console.log(`new user added ${result.name} email ${result.email}`);
        res.send('<h1>Added a user to the database</h1>')
    });
});
app.get('/users',async (req,res)=>{
    const database = client.database(databaseId);
    const container = database.container(containerId);
    const querySpec = {
        query: "SELECT * from c"
    };
    const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();
    items.forEach(item => {
        res.send('<h1>Name: ' + item.name + '</h1> \n <h1> Email: ' +item.email+' </h1> \n <h1> Password: ' +item.password + '</h1>')
        console.log(item);
        console.log(`ID = ${item.name} - Description is ${item.email} \n category ${item.password}`);
    });
})
