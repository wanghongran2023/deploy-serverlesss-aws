import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export async function handler(event) {

  	const todoId = event.pathParameters.todoId
  	const updatedTodo = JSON.parse(event.body)
	const userId = getUserId(event)

	try {
        	await updateTodo(userId,todoId,updatedTodo)
        	return {
            	statusCode: 201,
            	headers: {
                	'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true
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

