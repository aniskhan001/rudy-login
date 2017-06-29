# rudy-login-api

1. Install the dependencies `npm install`
2. Run using `npm start`
3. Test the API endpoints

## API Endpoints
1. POST `/api/signup` takes two headers in key/value pair: `name` and `password`
2. POST `/api/login` takes two headers in key/value pair: `name` and `password`
3. GET `/api/secret` takes additional header in key/value pair: `Authorization` <br>
   _(provide the logged in token value to access the secret page)_
