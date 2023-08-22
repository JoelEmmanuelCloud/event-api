import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class BadRequestError extends CustomAPIError {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

class NotFoundError extends CustomAPIError {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

class UnauthorizedError extends CustomAPIError {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export { CustomAPIError, BadRequestError, NotFoundError, UnauthorizedError };
