import { NextFunction, Request, Response } from 'express';
import { isTokenValid } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';

export interface ExtendedRequest extends Request {
    userId?: string;
}

const authenticateUser = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            error: 'Authentication token missing',
        });
        return;
    }

    try {
        const payload = isTokenValid({ token });
        req.userId = payload._id;
        next();
    } catch (error) {
        next(error);
    }
};

export { authenticateUser };
