import { promisify } from 'util';
const fs = require('fs');
const { DynamoDB } = require('aws-sdk');

(async () => {
  const source = new DynamoDB.DocumentClient({
    region: 'ap-southeast-1',
  });

  source.queryPromise = promisify(source.query);

  const response = await source.queryPromise({
    TableName: "build-my-prod-events",
    IndexName: "build-my-prod-events-status",
    KeyConditionExpression: "#s = :status",
    ExpressionAttributeNames:{
        "#s": "status",
    },
    ExpressionAttributeValues: {
        ":status": "upcoming"
    },
  });

  const handle = fs.openSync('events.json', 'w');

  fs.writeSync(handle, JSON.stringify(response.Items, null, 2));
})().catch((err) => console.error(err)) ;
