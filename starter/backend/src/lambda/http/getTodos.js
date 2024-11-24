import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todoTable = process.env.TODO_TABLE

export function handler(event) {
	console.log("query dynamodb")
	
	const result = await dynamoDbClient.scan({
		TableName: groupsTable
	})
	const items = result.Items

	return {
		statusCode: 200,
		headers:{
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			items
		})
	}
}
