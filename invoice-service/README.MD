# Invoice Service

The **Invoice Service** is a microservice built with [Restify](http://restify.com/) that listens for events from RabbitMQ (user, account, and order events) and generates monthly invoices based on user orders. It also provides REST endpoints to retrieve generated invoices.

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
   By default, the server will listen on port **8087**. You can change this by setting the `SERVER_PORT` environment variable.

### Additional Scripts

- **Development / Debug**:
  ```bash
  npm run debug
  ```
  This starts the service with the Node inspector enabled.
- **Production**:
  ```bash
  npm run start-prod
  ```
  This sets `ENV=prod` and starts the service.

---

## Environment Variables

| Variable       | Default | Description                                      |
|----------------|---------|--------------------------------------------------|
| `SERVER_PORT`  | 8087    | Specifies the port on which the server listens. |
| `ENV`          |         | When set to `prod`, the debug level is forced to `DEBUG`. |

---

## How It Works

1. **AllEvents** (`AllEvents.js`):
   - Listens for RabbitMQ messages on the `order`, `user`, and `account` queues.
   - When a new event is received, it updates the invoice database accordingly.
     - **`order.created`** events lead to the creation or updating of a user’s monthly invoice.
     - **`user.created`** and **`account.created`** events update or create shipping and customer details in the invoice database.

2. **Invoice Endpoints** (`invoices-route.js`):
   - Provides REST endpoints to retrieve invoices.

3. **BaseRoute** (`baseRoute.js`):
   - A common class providing shared logic for all routes (logging, utility methods, etc.).

---

## Routes

All endpoints are prefixed with `/invoice-service`. Below is a summary of the exposed API endpoints.

### Health Check

- **GET** `/health-check`
  - **Description**: Returns a simple response (e.g., `OK`) that confirms the service is online.

### Invoices

- **GET** `/invoice-service/invoices`
  - **Description**: Retrieves one or more invoices.  
  - **Query Parameters**:
    - `user_id`: Retrieve invoices for a specific user.
    - `month`: Filter by month.
    - `year`: Filter by year.

- **GET** `/invoice-service/invoices/:id`
  - **Description**: Retrieves a specific invoice by its `id`.

**Example**:
```
GET /invoice-service/invoices?user_id=123&month=3&year=2025
```
This returns the user’s invoice(s) for March 2025.

---

## Project Structure (Excerpt)

```
.
├── app/
│   ├── server.js              # Restify server entry point
│   ├── consumer/
│   │   └── AllEvents.js       # Consumes user/account/order events from RabbitMQ
│   ├── routes/
│   │   ├── health-check/
│   │   │   └── health-check.js
│   │   └── invoice/
│   │       └── invoices-route.js
│   ├── baseRoute.js           # Base routing class with shared logic
│   ├── databases/
│   │   ├── postgres-utils.js
│   │   └── rabbitmq.js
│   └── config/
│       └── setup-context.js
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

[MIT](LICENSE) – This project is open-sourced software licensed under the MIT license. You are free to adapt and use it in your own projects.