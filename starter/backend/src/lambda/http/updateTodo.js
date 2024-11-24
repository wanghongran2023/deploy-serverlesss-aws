import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { parseUserId } from '../../auth/utils.mjs'

const dynamoDb = new DynamoDB()
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb)
const dynamoDbDocument = DynamoDBDocument.from(dynamoDbXRay)
const todoTable = process.env.TODO_TABLE

export async function handler(event) {

  	const todoId = event.pathParameters.todoId
  	const updatedTodo = JSON.parse(event.body)
	const authorization = event.headers.Authorization
        const userId = parseUserId(authorization)
	
	let updateExpression = 'SET ';
	let expressionAttributeValues = {};
	let updateFields = [];
	  
	if (updatedTodo.dueDate) {
		updateFields.push('dueDate = :dueDate');
		expressionAttributeValues[':dueDate'] = updatedTodo.dueDate;
	}
	
	// attribute name is reserved in update statement
	const expressionAttributeNames = {"#name": "name"}
	if (updatedTodo.name) {
		updateFields.push('#name = :name');
		expressionAttributeValues[':name'] = updatedTodo.name;
	}
	if (updatedTodo.done !== undefined) {
		updateFields.push('done = :done');
		expressionAttributeValues[':done'] = updatedTodo.done;
	}
	updateExpression += updateFields.join(', ');

	try {
        	const result = await dynamoDbDocument.update({
			TableName: todoTable,
			Key: {
            			userId: userId,
            			todoId: todoId
        		},
        		UpdateExpression: updateExpression,
			ExpressionAttributeNames: expressionAttributeNames,
        		ExpressionAttributeValues: expressionAttributeValues,
        		ReturnValues: 'ALL_NEW'
		})

        	return {
            		statusCode: 201,
            		headers: {
                		'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
            		},
            		body: null
        	};
    	} catch (error) {
        	console.error('Error update DynamoDB:', error);
        	return {
            		statusCode: 500,
            		body: JSON.stringify({ message: 'Internal Server Error' })
        	};
    	}

}
