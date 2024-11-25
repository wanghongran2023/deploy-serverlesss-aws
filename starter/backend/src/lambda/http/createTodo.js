import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export async function handler(event) {
	const newTodoContent = JSON.parse(event.body)
    const userId = getUserId(event)
	try {
       	const newTodo = await createTodo(userId,newTodoContent)
        return {
           		statusCode: 201,
        		headers: {
            		'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true
        		},
				body: JSON.stringify({"item":newTodo})
        };
    } catch (error) {
    	return {
        		statusCode: 500,
        		body: JSON.stringify({ message: 'Internal Server Error' })
    	};
    }
	
}
