import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB());
const todoTable = process.env.TODO_TABLE;

export async function handler(event) {
	const todoId = event.pathParameters.todoId

	try {
		const result = await dynamoDbDocument.delete({
			TableName: todoTable,
            		Key: {
				userId: "test",
				todoId: todoId
			}
		});

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({ message: 'Item deleted successfully', result })
		};
	} catch (error) {
		console.error('Error deleting item from DynamoDB:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal Server Error' })
		};
	}
}

