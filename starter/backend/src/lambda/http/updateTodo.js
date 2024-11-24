import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())
const todoTable = process.env.TODO_TABLE

export async function handler(event) {

  	const todoId = event.pathParameters.todoId
  	const updatedTodo = JSON.parse(event.body)
	
	let updateExpression = 'SET ';
	let expressionAttributeValues = {};
	let updateFields = [];
	  
	if (updatedTodo.dueDate) {
		updateFields.push('dueDate = :dueDate');
		expressionAttributeValues[':dueDate'] = updatedTodo.dueDate;
	}
	if (updatedTodo.name) {
		updateFields.push('name = :name');
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
            			userId: "test",
            			todoId: todoId
        		},
        		UpdateExpression: updateExpression,
        		ExpressionAttributeValues: expressionAttributeValues,
        		ReturnValues: 'ALL_NEW'
		})

        	return {
            		statusCode: 201,
            		headers: {
                		'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
            		},
            		body: JSON.stringify(newTodo)
        	};
    	} catch (error) {
        	console.error('Error update DynamoDB:', error);
        	return {
            		statusCode: 500,
            		body: JSON.stringify({ message: 'Internal Server Error' })
        	};
    	}

}
