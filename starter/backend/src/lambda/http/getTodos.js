import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todoTable = process.env.TODO_TABLE

export function handler(event) {
	console.log("query dynamodb")
	try {
        	const result = await dynamoDbClient.scan({
            		TableName: todoTable
        	});
        	const items = result.Items;

        	return {
            		statusCode: 200,
            		headers: {
                		'Access-Control-Allow-Origin': '*'
            		},
            		body: JSON.stringify(items)
        	};
    	} catch (error) {
        	console.error('Error querying DynamoDB:', error);
        	return {
            		statusCode: 500,
            		body: JSON.stringify({ message: 'Internal Server Error' })
        	};
    	}
}
