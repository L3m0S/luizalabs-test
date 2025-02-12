# Luizalabs test

A RESTful API for managing customers, and customer favorites products, built with Node.js, Express, and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Installation(docker)](#installation-docker)
- [API Documentation](#api-documentation)
- [Running tests](#testes)

## Features

- Customer management (CRUD operations)
- Favorite products (CRUD operations)
- Pagination
- Input validation
- Error handling
- API documentation (Swagger/OpenAPI)

## Solução Proposta

The proposed solution is based on the following points:

- **Layered Architecture:** Clear separation between the routing layer (Express), business services, and the data access layer (TypeORM), facilitating maintenance and scalability.
- **Use of TypeScript:** Ensures strong typing, making development easier and reducing runtime errors.
- **Integration with External API:** Favorite products are fetched from an external API. To optimize performance, data is cached (in the "products" table in PostgreSQL), reducing latency and the number of external calls. Additionally, a circuit breaker is implemented so that if the external API fails, our API stops repeatedly attempting to access it. The cache TTL settings and circuit breaker configurations are controlled by environment variables found in the .env.exemple file.
- **Database::** The application uses a PostgreSQL database to persist customer data and their relationships with favorite products.
- **Containers with Docker:** Provides an isolated environment to facilitate setup and execution of the application across different environments.

## Pré-requisitos

- Node.js 22+
- PostgreSQL 14+
- Docker (opcional)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/L3m0S/luizalabs-test.git
```

2. Install dependencies:

```bash
npm i
```

3. create a .env file following .env.exemple file

4. Database:

```
You need to have a postgresql database running on your localhost
```

5. initiate API:

```bash
npm start
```

## Installation-docker

1. Clone the repository:

```bash
git clone [your-repository-url]
```

2. Clone the repository:

```bash
docker compose --build -d
```

#api-documentation

1. Clone the repository:

- To view the api documentation, after starting the project you need to access the GET /api/api-docs from the browser

## testes

```bash
npm test
```
