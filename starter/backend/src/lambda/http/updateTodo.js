import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())
const todoTable = process.env.TODO_TABLE

export async function handler(event) {

  	const todoId = event.pathParameters.todoId
  	const updatedTodo = JSON.parse(event.body)

	try {
        	const result = await dynamoDbDocument.update({
			TableName: todoTable,
			Key: {
            			userId: "test",
            			todoId: todoId
        		},
        		UpdateExpression: 'SET dueDate = :dueDate, name = :name, done = :done',
        		ExpressionAttributeValues: {
            			':dueDate': updatedTodo.dueDate,
           	 		':name': updatedTodo.name,
            			':done': updatedTodo.done
        		},
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
