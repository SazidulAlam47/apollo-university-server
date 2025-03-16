import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { verifyToken } from '../modules/auth/auth.utils';

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new AppError(
                    status.UNAUTHORIZED,
                    'You are not authorized',
                );
            }
            const token = authHeader.split(' ')[1]; // Extract token after "Bearer"
            if (!token) {
                throw new AppError(
                    status.UNAUTHORIZED,
                    'You are not authorized',
                );
            }
            // check the token is valid
            const decoded = verifyToken(
                token,
                config.jwt_access_secret as string,
            );

            const { id, role, iat } = decoded;

            const user = await User.isUserExistsByCustomId(id);

            if (!user) {
                throw new AppError(
                    status.UNAUTHORIZED,
                    'You are not authorized',
                );
            }
            if (user.isDeleted) {
                throw new AppError(status.FORBIDDEN, 'Forbidden access');
            }
            if (user.status === 'blocked') {
                throw new AppError(status.FORBIDDEN, 'Forbidden access');
            }

            if (
                user?.passwordChangedAt &&
                User.isJWTIssuedBeforePasswordChanged(
                    user.passwordChangedAt,
                    iat as number,
                )
            ) {
                throw new AppError(status.FORBIDDEN, 'Forbidden access');
            }

            if (requiredRoles.length && !requiredRoles.includes(role)) {
                throw new AppError(status.FORBIDDEN, 'Forbidden access');
            }
            req.user = decoded;
            next();
        },
    );
};

export default auth;
