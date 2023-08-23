# CRUD Application for Users and Events

## Description

This project is a CRUD application that allows users to manage events. It provides endpoints for creating, reading, and deleting events. The application uses token-based authentication to secure certain routes and store data in a MongoDB database. Input validation is performed using Joi, and the codebase follows Prettier and ESLint standards. Unit testing is implemented using Jest, aiming for at least 50% code coverage. The project utilizes JWT authentication and the token is sent in headers for security. Error handling is implemented throughout the application.

## Installation

Clone the repository:

```bash
    git clone https://github.com/JoelEmmanuelCloud/event-api
```

## Install dependencies:

All dependencies are pre-installed in the package.json file.

Install the required dependencies using npm:

```bash
    npm install
```

## Set up the environment variables:

Create a `.env` file in the root directory of the project. Define the following environment variables in the `.env file`:

```bash
    JWT_SECRET=jwtSecret
    JWT_LIFETIME=1d
    MONGO_URL = MongoDB connection string
    JWT_SECRET is the Secret key for JWT token generation.
```

If you don't already have a MongoDB account, you must create one to obtain your `MongoDB connection string` and establish a connection. Visit the [MongoDB](https://www.mongodb.com) website to create your account and replace the `MongoDB connection string` with your actual connection string.

## Features

### User Management

-   Sign up new users with first name, last name, birth date, city, country, email, and password.
-   Sign in existing users with email and password.
-   Account email is unique.

### Event Management

-   Create new events with descriptions and days of the week.
-   Retrieve events by day of the week.
-   Retrieve events by their unique ID.
-   Delete events by ID and day of the week.

### Authentication

-   Token-based authentication using JWT.
-   Token sent in headers for security.
-   Private routes that require authorization.

### Error Handling

-   Proper error handling for various scenarios.
-   Consistent error response format.

### Code Quality

-   Prettier and ESLint for code formatting and linting.
-   Input validation using Joi.

## Endpoints

### User Routes

-   `POST /users/sign-up`: Sign up a new user.
-   `POST /users/sign-in`: Sign in as an existing user.

### Event Routes

-   `POST /events`: Create a new event (authentication required).
-   `GET /events`: Retrieve events by day of the week (authentication required).
-   `DELETE /events`: Delete events by day of the week (authentication required).
-   `GET /events/{id}`: Retrieve an event by ID (authentication required).
-   `DELETE /events/{id}`: Delete an event by ID (authentication required).

## Testing

To run unit tests and generate code coverage, use the following command:

```bash
    npx jest --coverage
```

### Expected Results:
![Screenshot 2023-08-23 235751](https://github.com/JoelEmmanuelCloud/event-api/assets/123770803/36d2e321-67fe-4421-a979-280eb2d96171)


## Technologies Used

-   Node.js
-   TypeScript
-   Express.js
-   MongoDB
-   Jest (for testing)
-   JSON Web Tokens (JWT)
-   Joi (Input validation)
-   Prettier/ESLint (Code formatting and linting)

## Author

Joel Emmanuel-(Compass.uol Node.js trail student)

## License

This project is licensed under the MIT License.

## Acknowledgements

Special thanks to the Compass.uol scholarship program for providing this challenging opportunity to learn from experienced instructors and showcase our skills.
