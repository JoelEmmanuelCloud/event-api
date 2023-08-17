import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

interface CustomError {
    statusCode: number;
    msg: string;
}

const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log(err);
    let customError: CustomError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later',
    };

    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors)
            .map((item: any) => item.message)
            .join(',');
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(
            err.keyValue,
        )} field, please choose another value`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }

    return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
