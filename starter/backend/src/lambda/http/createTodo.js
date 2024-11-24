import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())
const todoTable = process.env.TODO_TABLE

export async function handler(event) {
  
	const itemId=uuidv4()
	const newTodoContent = JSON.parse(event.body)

  	const newTodo ={
		userId: "test",
		todoId: itemId,
		createdAt: new Date().toISOString(),
		...newTodoContent
	}

	try {
        	await dynamoDbDocument.put({
			TableName: todoTable,
			Item: newTodo
		})

        	return {
            		statusCode: 201,
            		headers: {
                		'Access-Control-Allow-Origin': '*'
            		},
            		body: JSON.stringify(newTodo)
        	};
    	} catch (error) {
        	console.error('Error querying DynamoDB:', error);
        	return {
            		statusCode: 500,
            		body: JSON.stringify({ message: 'Internal Server Error' })
        	};
    	}
	
}

