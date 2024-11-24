import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { getUserId } from '../utils.mjs'

const dynamoDb = new DynamoDB()
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb)
const dynamoDbDocument = DynamoDBDocument.from(dynamoDbXRay)
const todoTable = process.env.TODO_TABLE

export async function handler(event) {
	console.log("query dynamodb")

	const userId = getUserId(event)

	try {
        	const result = await dynamoDbDocument.query({
    			TableName: todoTable,
    			KeyConditionExpression: "userId = :userId",
    			ExpressionAttributeValues: {
        			":userId": userId,
    			},
		});
        	const items = result.Items;

        	return {
            		statusCode: 200,
            		headers: {
                		'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
            		},
            		body: JSON.stringify({"items":items})
        	};
    	} catch (error) {
        	console.error('Error querying DynamoDB:', error);
        	return {
            		statusCode: 500,
            		body: JSON.stringify({ message: 'Internal Server Error' })
        	};
    	}
}
