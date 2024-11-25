import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'

export class AttachmentUtils{
    constructor(
        bucketName = process.env.S3_BUCKET,
        s3Client = AWSXRay.captureAWSv3Client(new S3Client()),
        urlExpiration = parseInt(process.env.URL_EXPIRATION)
    ){
        this.bucketName=bucketName,
        this.s3Client=s3Client,
        this.urlExpiration=urlExpiration
    }

    async getAttachmentURL(todoId){
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: todoId+".png"
        })
        const url = await getSignedUrl(this.s3Client, command, {expiresIn: this.urlExpiration})
        return url
    }

    getBucketName(){
        return this.bucketName
    }
}

