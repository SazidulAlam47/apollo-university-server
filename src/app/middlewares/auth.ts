import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

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
            const decoded = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload;

            const { id, role, iat } = decoded;

            const user = await User.isUserExistsByCustomId(id);

            if (!user) {
                throw new AppError(status.NOT_FOUND, 'User not fund');
            }
            if (user.isDeleted) {
                throw new AppError(status.FORBIDDEN, 'User is deleted');
            }
            if (user.status === 'blocked') {
                throw new AppError(status.FORBIDDEN, 'User is blocked');
            }

            if (
                user?.passwordChangedAt &&
                User.isJWTIssuedBeforePasswordChanged(
                    user.passwordChangedAt,
                    iat as number,
                )
            ) {
                throw new AppError(status.UNAUTHORIZED, 'User is Unauthorized');
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
