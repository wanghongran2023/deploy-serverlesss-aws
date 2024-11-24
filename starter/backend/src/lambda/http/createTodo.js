import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { parseUserId } from '../../auth/utils.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDb = new DynamoDB()
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb)
const dynamoDbDocument = DynamoDBDocument.from(dynamoDbXRay)
const todoTable = process.env.TODO_TABLE
const bucketName = process.env.S3_BUCKET;

export async function handler(event) {
  
	const todoId=uuidv4()
	const newTodoContent = JSON.parse(event.body)
	const authorization = event.headers.Authorization
	const userId = parseUserId(authorization)

  	const newTodo ={
		userId: userId,
		todoId: todoId,
		createdAt: new Date().toISOString(),
		attachmentUrl: 'https://'+bucketName+'.s3.amazonaws.com/'+todoId+'.png',
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
                		'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
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

