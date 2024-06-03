# job-service-api# Job Application Service

A backend service for a job application website built with Nest.js, GraphQL, and MongoDB.

## Project Overview

This service provides functionality for:
- User authentication and registration (JWT-based)
- Managing job listings (for companies)
- Applying for jobs (for applicants)
- Handling application statuses (pending, rejected, hired)

## Tech Stack

- **Backend Framework**: Nest.js (TypeScript)
- **GraphQL**: Apollo Server
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)

### Installation

1. Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:
MONGODB_URI=mongodb://mongo:27017/job-db
PORT=3000
JWT_SECRET=your_jwt_secret_key


### Docker Setup

1. Build and run the containers:
    ```bash
    docker-compose up --build
    ```

   This will start two services:
   - **app**: The Nest.js application running on port 3000
   - **mongo**: The MongoDB database running on port 27017

2. To stop the containers:
    ```bash
    docker-compose down
    ```

### Local Development

1. Start the Nest.js server:
    ```bash
    npm run start:dev
    ```

2. The server will be running on `http://localhost:3000/graphql`.

