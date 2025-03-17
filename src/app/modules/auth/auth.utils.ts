/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import ms from 'ms';
import AppError from '../../errors/AppError';
import status from 'http-status';

export const createToken = (
    jwtPayload: {
        id: string;
        role: string;
    },
    secret: string,
    expiresIn: ms.StringValue,
) => {
    const options: SignOptions = { expiresIn };
    return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
        throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
    }
};
