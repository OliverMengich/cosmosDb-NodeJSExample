const config = require('../config');
//const CosmosClient = require('@azure/cosmos').CosmosClient;

async function create(client, databaseId,containerId){
    const partitionKey = config.partitionKey;

    //create a database if it doesn't exist
    const {database} = await client.databases.createIfNotExists({
        id: databaseId
    });
    console.log(`Created database ${database.id} \n`);

    //create a container
    const {container} = await client.database(databaseId).containers.createIfNotExists({
        id: containerId, partitionKey}, 
        {offerThroughput: 400}
    );
    console.log(`Created container \n ${container.id} \n`)
}
module.exports = {create};