# Transaction - API

## Getting Started
* Setup environment
```
Setup the environment variable for your root and database configuration
```

* Installation
```
npm ci
```

* Starting the Program
```
npm start
```

* Running the Tests
```
npm run test
```

* create .env file in the root
```
PORT=3000
DB_NAME='transaction_api'
DB_USER_NAME='your username'
DB_PASSWORD='your password'
DB_HOST=localhost
DB_DIALECT='postgres'

```

## Access in browser
```localhost:3000/```

## End Point
* GET /users/:id
```
Response
{
    "id": 1,
    "name": "Mitshuki Temannya Boruto",
    "cashtag": "mitshuki",
    "address": "suatu rumah di konoha",
    "phoneNumber": "+12345631234",
    "email": "mitshuki@konoha.com",
    "profileImage": "img/mitshuki.jpg",
    "createdAt": "2019-12-01T00:03:03.410Z",
    "updatedAt": "2019-12-01T00:05:34.764Z"
}
```
* POST /users
```
Body request
{
    "name": "Mitshuki Temannya Boruto",
    "email": "mitshuki@konoha.com",
    "phoneNumber": "+1 123321123",
    "address": "suatu rumah di konoha",
    "profileImage": "img/mitshuki.jpg"
}
```
* PUT /users/:id

```
Body request could be one of {name, address, phoneNumber, email, profileImage} only or all
{
    "phoneNumber": "+12345631234"
}
```
* GET /users/:id/wallets
```
Response
{
    "id": 1,
    "userId": 1,
    "balance": 800,
    "createdAt": "2019-12-01T00:03:03.416Z",
    "updatedAt": "2019-12-01T00:30:07.440Z"
}
```
* POST /users/:id/wallets/transactions
```
Body request {description, type, nominal}
{
    "type": "withdraw",
    "nominal": 100,
    "description": "test",
    "beneficiaryId: 2 or null (if none beneficiary)
}
```
* GET /users/:id/wallets/transactions
```
Response
[
    {
        "id": 1,
        "walletId": 1,
        "nominal": 1000,
        "balance": 1000,
        "type": "deposit",
        "description": "test",
        "createdAt": "2019-12-01T00:03:03.432Z",
        "updatedAt": "2019-12-01T00:03:03.432Z",
        "beneficiaryData": {
            "id": 1,
            "name": "Mitshuki Temannya Boruto"
        }
    },
    {
        "id": 2,
        "walletId": 1,
        "nominal": 100,
        "balance": 900,
        "type": "withdraw",
        "description": "test",
        "createdAt": "2019-12-01T00:10:18.917Z",
        "updatedAt": "2019-12-01T00:10:18.917Z",
        "beneficiaryData": {}
    }
]
```

