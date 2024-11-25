import { getAttachmentURL } from "../../businessLogic/todos.mjs";

export async function handler(event) {
	const todoId = event.pathParameters.todoId
	try {
  		const url = await getAttachmentURL(todoId)
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({ 'uploadUrl': url })
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal Server Error' })
		};
	}

}
