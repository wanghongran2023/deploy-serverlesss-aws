import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import AWSXRay from 'aws-xray-sdk-core'
import { parseUserId } from '../../auth/utils.mjs'

const dynamoDb = new DynamoDB()
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb)
const dynamoDbDocument = DynamoDBDocument.from(dynamoDbXRay)
const todoTable = process.env.TODO_TABLE;

export async function handler(event) {
	const todoId = event.pathParameters.todoId
	const authorization = event.headers.Authorization
        const userId = parseUserId(authorization)

	try {
		const result = await dynamoDbDocument.delete({
			TableName: todoTable,
            		Key: {
				userId: userId,
				todoId: todoId
			}
		});

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: null
		};
	} catch (error) {
		console.error('Error deleting item from DynamoDB:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal Server Error' })
		};
	}
}

