require('dotenv').config();
const config = {
    endpoint: '<Your CosmosDB Endpoint>',
    key: 'Your cosmosDB key',
    databaseId: 'your databaseID',
    containerId: 'your category' ,
    partitionKey: { kind: "Hash", paths: ["/category"] }
};
  
module.exports = config;