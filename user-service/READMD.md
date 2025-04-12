# User Service

This is a simple REST API built with [Restify](http://restify.com/) that demonstrates basic CRUD operations for Users and Accounts. It also includes a health-check endpoint to verify the service is up and running.

---

## Installation

1. **Clone the repository** (or download the source code).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the service**:
   ```bash
   npm start
   ```
   By default, the server will listen on port **8085**. You can change this by setting the `SERVER_PORT` environment variable.

### Additional Scripts

- **Development / Debug**:
  ```bash
  npm run debug
  ```
  This will start the service with the Node inspector enabled.
- **Production**:
  ```bash
  npm run start-prod
  ```
  This sets `ENV=prod` and starts the service.

---

## Environment Variables

| Variable       | Default | Description                             |
|----------------|---------|-----------------------------------------|
| `SERVER_PORT`  | 8085    | Specifies the port on which the server listens. |
| `ENV`          |         | When set to `prod`, the debug level is forced to `DEBUG`. |

---

## Routes

Below is a summary of the available API endpoints.

### Health Check

- **GET** `/health-check`
  - **Description**: Returns a simple status response indicating the service is healthy (e.g., `OK`).

### Users

- **GET** `/system-api/users`
  - **Description**: Retrieves a list of users.  
  - **Query Parameters** (optional):  
    - `limit`: number of items to return  
    - `offset`: number of items to skip before starting to collect the result set  
    - `order_by`: column name to order by  

- **POST** `/system-api/users`
  - **Description**: Creates one or more new user records.  
  - **Request Body**: JSON object representing the user(s) to insert. For example:
    ```json
    {
      "first_name": "Alice",
      "last_name": "Example",
      "email": "alice@example.com"
    }
    ```

### Accounts

- **GET** `/system-api/accounts`
  - **Description**: Retrieves a list of accounts.  
  - **Query Parameters** (optional):  
    - `limit`: number of items to return  
    - `offset`: number of items to skip  
    - `order_by`: column name to order by  

- **POST** `/system-api/accounts`
  - **Description**: Creates one or more new account records.  
  - **Request Body**: JSON object representing the account(s) to create. For example:
    ```json
    {
      "account_name": "Main Account",
      "user_id": 1234
    }
    ```

---

## Project Structure (Excerpt)

```
.
├── app/
│   ├── server.js             # Entry point for the Restify server
│   ├── routes/
│   │   ├── health-check/
│   │   │   └── health-check.js
│   │   ├── users/
│   │   │   └── users-route.js
│   │   └── account/
│   │       └── accounts-route.js
│   ├── config/
│   │   └── setup-context.js
│   └── baseRoute.js
├── package.json
└── README.md
```

---

## Contributing

1. Fork the repository and create your branch from `main`.
2. Make your changes and ensure your code builds and runs without errors.
3. Submit a pull request (PR) explaining your changes.

---

## License

[MIT](LICENSE) – This project is open-sourced software licensed under the MIT license. Feel free to adapt and use it in your own projects.