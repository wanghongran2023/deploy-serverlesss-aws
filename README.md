# Serverless Application

This project introduces a method to deploy serverless applications in AWS. It also includes a guide for implementing authentication using Auth0.

---

## **Steps to Set Up the Application: Frontend**

### 1. Edit the `.env` File
- Navigate to the `client` folder and edit the `.env` file.
- Add the following information:
  - `REACT_APP_AUTH0_DOMAIN`
  - `REACT_APP_AUTH0_CLIENT_ID`
  - `REACT_APP_API_ENDPOINT`
- You can find this information in your Auth0 application settings and the AWS API Gateway stage endpoint.

### 2. Update Audience URL
- Navigate to the `starter/client/src/components` folder.
- Update the audience URL in the `.jsx` files to your Auth0 application audience URL. Replace placeholders like `https://<id>.us.auth0.com/api/v2/` with your specific URL.

### 3. Install Dependencies and Start the Client
- Run the following commands:
  - `npm install`
  - `npm run start`

### 4. Set Up HTTPS
- Auth0 requires all URLs to use the HTTPS protocol.
- So you need to set up https for your client server


## **Steps to Set Up the Application: Backend**

1. Navigate to the `backend/src/lambda/auth` folder and update the certificate in the `auth0Authorizer.mjs` file with your Auth0 certificate.  

2. Set up the following GitHub Action parameters:  
   - `AWS_ACCESS_KEY_ID`  
   - `AWS_SECRET_ACCESS_KEY`  
   - `AWS_REGION`  

3. Ensure the IAM user associated with the credentials in step 2 has the necessary permissions for:  
   - S3  
   - DynamoDB  
   - API Gateway  

4. Edit the code as needed and push it to GitHub. The GitHub Action workflow will automatically deploy the API to API Gateway.
