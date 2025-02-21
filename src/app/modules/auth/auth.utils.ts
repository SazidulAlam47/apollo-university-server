import jwt, { SignOptions } from 'jsonwebtoken';
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
