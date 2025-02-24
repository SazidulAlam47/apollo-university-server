import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import ms from 'ms';

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

export const verifyToken = (token: string, secret: string) =>
    jwt.verify(token, secret) as JwtPayload;
