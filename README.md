# Node-Express-MongoDB POC - Hope

Online assignment for Sr. Solution Architect Role

# Setup Guid

  - Clone the repo into local.
  - Change config values based on the your local on './config/default.yaml'

# To run the script
```
node cli.js users // To import the users from api mock
node cli.js posts // To import the posts from api mock
```
# To build and run the webservice
```
npm install
node index.js
```
# To get the access token
```
curl --location --request POST 'http://localhost:9000/api/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "{{username}}",
    "password": "{{password}}"
}'
```
# Access the webserive using access token
```
curl --location --request GET 'http://localhost:9000/api/admin/posts' \
--header 'Authorization: Bearer {{access_token}}'
```
# Webservice Endpoints
```
POST /api/auth -- For login, in response you get access_token
GET /api/health -- To check webservice, Also used handshake with other api
GET /api/users -- To get the currnet loing user information
GET /api/posts -- To get the currnet loing user posts
GET /api/admin/users -- Admin endpoint - to list all users
GET /api/admin/posts -- Admin endpoint - to list all user's posts.
```