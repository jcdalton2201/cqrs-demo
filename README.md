# 🧩 CQRS Demo – Architecture & Documentation

## 🧠 What is CQRS?

**CQRS (Command Query Responsibility Segregation)** is a design pattern that separates **commands** (write operations) from **queries** (read operations). Instead of a single model for both reading and writing data, CQRS uses:

- A **Command Model** to handle inserts, updates, deletes.
- A **Query Model** to return pre-computed, read-optimized views of data.

> This separation enables systems to scale, evolve, and optimize differently for each concern.

---

## 🎯 Purpose of this Demo

This demo showcases **CQRS with microservices** using:

- **Event-driven architecture** via **RabbitMQ**
- **Independent read and write models**
- **Database per service** pattern
- **Loose coupling via domain events**

It simulates a simple e-commerce scenario with:
- **User onboarding**
- **Account creation**
- **Order placement**
- **Invoice generation based on orders**

---

## 🧱 Services Overview

| Service         | Type        | Responsibility                                         | DB Tables             | Event Role            |
|------------------|-------------|----------------------------------------------------------|------------------------|------------------------|
| **User Service** | Command     | Manages `Users` and `Accounts`                          | `demo.users`, `demo.accounts` | Publishes `user.created`, `account.created` |
| **Order Service** | Command     | Handles product `Orders`                                 | `demo.orders`          | Publishes `order.created`         |
| **Invoice Service** | Query      | Generates `Invoices` from received events               | `demo.invoice_account`, `demo.invoices` | Subscribes to all events       |

---

## 🔀 Architecture Diagram (Conceptual)

```text
                +----------------+          +----------------+
                |  User Service  | -------> |  RabbitMQ (user queue)
                +----------------+          +----------------+
                         |
                         |                         +------------------+
                         |                         | Invoice Service   |
                +----------------+          -----> | Listens to Events |
                | Order Service  | ------->         +------------------+
                +----------------+          --->    Processes Invoices
                      |
                      |                                 |
                      +--------------------------->     +---------------------+
                                        (account queue)  |  invoice_account    |
                                                         |  invoices           |
                                                         +---------------------+
```

---

## 🧪 Step-by-Step Flow

### 1. Create User

- **API**: `POST /system-api/users`
- **DB**: Saves to `demo.users`
- **Event**: Publishes `user.created` with `{ id, name, email }`
- **Invoice Service**:
  - Receives `user.created`
  - Inserts into `demo.invoice_account`

---

### 2. Create Account

- **API**: `POST /system-api/accounts`
- **DB**: Saves to `demo.accounts`
- **Event**: Publishes `account.created` with address details
- **Invoice Service**:
  - Receives `account.created`
  - Updates `shipping_address` in `invoice_account`

---

### 3. Create Order

- **API**: `POST /order-service/orders`
- **DB**: Saves to `demo.orders`
- **Event**: Publishes `order.created` with order metadata
- **Invoice Service**:
  - Receives `order.created`
  - Looks up user & shipping info from `invoice_account`
  - Checks if an invoice exists for `(user_id, month, year)`
    - If not, creates new `demo.invoices` entry
    - If yes, appends to `orders` JSONB array and updates `total`

---

### 4. Retrieve Invoice

- **API**: `GET /invoice-service/invoices?user_id=1&month=4&year=2025`
- **DB**: Queries `demo.invoices`
- **Result**:
  ```json
  {
    "invoice_id": "abc-123",
    "user_id": 1,
    "email": "alice@demo.com",
    "shipping_address": "123 Main St, Cityville, ST 12345",
    "invoice_dt": "2025-04-01T00:00:00Z",
    "orders": [
      { "description": "Widget", "amount": 50.00, "purchase_dt": "..." },
      ...
    ],
    "total": 150.00
  }
  ```

---

## ⚙️ Technology Stack

| Component         | Tool                    | Purpose                                  |
|------------------|--------------------------|------------------------------------------|
| HTTP Framework    | Restify                 | Lightweight REST API layer               |
| Messaging         | RabbitMQ               | Event queue between services             |
| DB Driver         | `pg` for PostgreSQL     | Async database access                    |
| Logging           | `log4js`                | Structured logging                       |
| Testing           | `mocha`, `chai`, `sinon`| Functional/unit testing support          |
| Linting           | `eslint`, `prettier`    | Code style enforcement                   |

---

## 🧵 Patterns Implemented

### ✅ CQRS

- Clear split between command-side (User/Order) and query-side (Invoice)

### ✅ Event-Driven Architecture

- Services communicate **exclusively through events**
- Promotes **loose coupling** and **reactivity**

### ✅ Data Duplication for Performance

- Invoice Service stores a **read-optimized** copy of user/account data
- Prevents joins at query time, speeds up reporting

### ✅ Database per Service

- Each microservice is **autonomous**
- Minimizes schema coupling and migration dependencies

---

## 📦 Folder Structure Summary

Each service follows a consistent layout:

```
app/
├── server.js               # Entry point
├── routes/                 # HTTP route handlers
│   └── <entity>/<name>.js
├── consumer/               # RabbitMQ event consumers (Invoice Service only)
├── event/                  # RabbitMQ event publishers (User & Order Services)
├── databases/              # Postgres & RabbitMQ utils
├── config/                 # Environment/config setup
├── util/                   # Logging, auth, etc.
└── baseRoute.js            # Base class for HTTP route reuse
```

---

## 🧩 Future Enhancements

Here are some ideas to make the CQRS demo more robust:

| Idea                         | Benefit                                      |
|------------------------------|----------------------------------------------|
| Add **Event Replay** logic   | Helps replay or recover from failures       |
| Use **Protobuf or Avro**     | For strict event typing and evolution       |
| Integrate **Kafka**          | More durable and scalable event backbone    |
| Add **Audit/Event Store**    | Enables full **event sourcing**             |
| Add **Saga Pattern**         | Support for distributed transactions        |
| Separate Read DB (Mongo/ES)  | High-speed queries on JSONB or NoSQL        |

---

## 📣 Summary

This project demonstrates a **realistic mini-ecosystem** for CQRS, where:

- **User Service** and **Order Service** handle domain commands.
- **Invoice Service** listens for events and builds denormalized, query-optimized invoices.
- **RabbitMQ** glues the services together via asynchronous event handling.

The demo illustrates **scalability**, **autonomy**, and **event-driven processing**—key principles for modern, resilient microservices architecture.
