import jwt from 'jsonwebtoken';
import { Payload } from '../interfaces/userTypes';

const createJWT = ({ payload }: { payload: Payload }): string => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_LIFETIME!,
    });
    return token;
};

const isTokenValid = ({ token }: { token: string }): Payload => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as Payload;
    return decodedToken;
};

export { createJWT, isTokenValid };
