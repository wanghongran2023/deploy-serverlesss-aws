import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodosAccess{
    constructor(
        dynamoDbDocument=DynamoDBDocument.from(AWSXRay.captureAWSv3Client(new DynamoDB())),
        todoTable = process.env.TODO_TABLE
    ){
        this.dynamoDbDocument=dynamoDbDocument,
        this.todoTable=todoTable
    }

    async getTodos(userId){
        const result = await this.dynamoDbDocument.query({
            TableName: this.todoTable,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
        });
        return result.Items
    }

    async createTodos(newTodo){
        const result =await this.dynamoDbDocument.put({
			TableName: this.todoTable,
			Item: newTodo
		})
        return newTodo
    }

    async deleteTodos(userId,todoId){
		await this.dynamoDbDocument.delete({
			TableName: this.todoTable,
            Key: {
				userId: userId,
				todoId: todoId
			}
		});
        return null
    }

    async updateTodos(userId,todoId,updateExpression,expressionAttributeNames,expressionAttributeValues){
        await this.dynamoDbDocument.update({
			TableName: this.todoTable,
			Key: {
            	userId: userId,
            	todoId: todoId
        	},
        	UpdateExpression: updateExpression,
			ExpressionAttributeNames: expressionAttributeNames,
        	ExpressionAttributeValues: expressionAttributeValues,
        	ReturnValues: 'ALL_NEW'
		})
        return null
    }

}
