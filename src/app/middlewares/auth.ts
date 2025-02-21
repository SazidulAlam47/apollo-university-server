import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError(
                    status.UNAUTHORIZED,
                    'You are not authorized',
                );
            }
            // check the token is valid
            jwt.verify(
                token,
                config.jwt_access_token as string,
                function (err, decoded) {
                    // err
                    if (err) {
                        throw new AppError(
                            status.UNAUTHORIZED,
                            'You are not authorized',
                        );
                    }
                    // decoded

                    const role = (decoded as JwtPayload)?.role;

                    if (requiredRoles.length && !requiredRoles.includes(role)) {
                        throw new AppError(
                            status.FORBIDDEN,
                            'Forbidden access',
                        );
                    }
                    req.user = decoded as JwtPayload;
                    next();
                },
            );
        },
    );
};

export default auth;
