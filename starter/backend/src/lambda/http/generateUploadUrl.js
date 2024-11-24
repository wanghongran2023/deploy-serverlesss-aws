import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucketName = process.env.S3_BUCKET;
const s3Client = new S3Client()
const urlExpiration = parseInt(process.env.URL_EXPIRATION)

export async function handler(event) {
	const todoId = event.pathParameters.todoId
	
	try {
		const command = new PutObjectCommand({
    			Bucket: bucketName,
    			Key: todoId+".png"
  		})
  		const url = await getSignedUrl(s3Client, command, {expiresIn: urlExpiration})

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({ 'uploadUrl': url })
		};
	} catch (error) {
		console.error('Error generating URL:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'Internal Server Error' })
		};
	}

}

