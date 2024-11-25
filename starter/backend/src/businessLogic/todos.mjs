import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../utils/logger.mjs'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs'

const logger = createLogger('todoAccess')
const todosAccess=new TodosAccess()
const attachmentUtils=new AttachmentUtils()

export async function getTodos(userId){
    logger.info("Start get Todos for user "+userId)
    return await todosAccess.getTodos(userId)
}

export async function createTodo(userId,newTodoContent){
    logger.info("Start create Todo for user "+userId)
    const todoId=uuidv4()
    const bucketName=attachmentUtils.getBucketName()
    const newTodo ={
		userId: userId,
		todoId: todoId,
		done: false,
		createdAt: new Date().toISOString(),
		attachmentUrl: 'https://'+bucketName+'.s3.amazonaws.com/'+todoId+'.png',
		...newTodoContent
	}
    return await todosAccess.createTodos(newTodo)
}

export async function deleteTodo(userId,todoId){
    logger.info("Delete Todo with id "+todoId+" for user "+userId)
    return await todosAccess.deleteTodos(userId,todoId)
}


export async function updateTodo(userId,todoId,updatedTodo){
    logger.info("Update Todo with id "+todoId+" for user "+userId)
    let updateExpression = 'SET ';
	let expressionAttributeValues = {};
	let updateFields = []; 
	if (updatedTodo.dueDate) {
		updateFields.push('dueDate = :dueDate');
		expressionAttributeValues[':dueDate'] = updatedTodo.dueDate;
	}
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
    return await todosAccess.updateTodos(userId,todoId,updateExpression,expressionAttributeNames,expressionAttributeValues)
}


export async function getAttachmentURL(todoId){
    logger.info("Start generate presignedURL for todo "+todoId)
    return await attachmentUtils.getAttachmentURL(todoId)
}
