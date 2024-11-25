import { deleteTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs'


export async function handler(event) {
	const todoId = event.pathParameters.todoId

	const userId = getUserId(event)

	try {
		await deleteTodo(userId,todoId)
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: null
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal Server Error' })
		};
	}
}


