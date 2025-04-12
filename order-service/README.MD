# Order Service

This is a simple REST API built with [Restify](http://restify.com/) that demonstrates basic CRUD operations for Orders. It also includes a health-check endpoint to verify the service is up and running. The service publishes order-related events to a RabbitMQ queue for integration with other parts of a CQRS (Command Query Responsibility Segregation) system.

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
   By default, the server will listen on port **8086**. You can change this by setting the `SERVER_PORT` environment variable.

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
| `SERVER_PORT`  | 8086    | Specifies the port on which the server listens. |
| `ENV`          |         | When set to `prod`, the debug level is forced to `DEBUG`. |

---

## Routes

All endpoints are prefixed with `/order-service`. Below is a summary of the available API endpoints.

### Health Check

- **GET** `/health-check`
  - **Description**: Returns a simple status response indicating the service is healthy (e.g., `OK`).

### Orders

- **GET** `/order-service/orders`
  - **Description**: Retrieves a list of orders.
  - **Query Parameters** (optional):
    - `limit`: number of items to return  
    - `offset`: number of items to skip before starting to collect the result set  
    - `order_by`: column name to order by  

- **POST** `/order-service/orders`
  - **Description**: Creates one or more new order records and publishes an `order.created` event to RabbitMQ.
  - **Request Body**: JSON object representing the order(s) to create. For example:
    ```json
    {
      "user_id": 123,
      "amount": 99.99,
      "status": "NEW"
    }
    ```

---

## Events

The `OrderEvents.js` module publishes order-related events to RabbitMQ. Specifically:
- **publishOrderCreated**: Publishes an event with the payload of the newly created order to the `order` queue.

This allows other microservices in your CQRS architecture to consume these events and perform subsequent actions (e.g., generating invoices, sending notifications, etc.).

---

## Project Structure (Excerpt)

```
.
├── app/
│   ├── server.js            # Entry point for the Restify server
│   ├── routes/
│   │   ├── health-check/
│   │   │   └── health-check.js
│   │   └── order/
│   │       └── order-routes.js
│   ├── baseRoute.js         # Base routing class with shared logic
│   ├── event/
│   │   └── OrderEvents.js   # Publishes order-related events to RabbitMQ
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

[MIT](LICENSE) – This project is open-sourced software licensed under the MIT license. Feel free to adapt and use it in your own projects.