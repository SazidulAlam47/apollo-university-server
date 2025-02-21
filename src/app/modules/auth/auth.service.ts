import status from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
    // if the user is exists
    const user = await User.isUserExistsByCustomId(payload.id);

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not fund');
    }
    if (user.isDeleted) {
        throw new AppError(status.FORBIDDEN, 'User is deleted');
    }
    if (user.status === 'blocked') {
        throw new AppError(status.FORBIDDEN, 'User is blocked');
    }
    // checking password
    if (!(await User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError(status.FORBIDDEN, 'Password did not matched');
    }

    // Access granted: send access token, refresh token
    const jwtPayload = {
        id: user.id,
        role: user.role,
    };

    const accessToken = jwt.sign(
        jwtPayload,
        config.jwt_access_token as string,
        { expiresIn: '10d' },
    );

    return { accessToken, needsPasswordChange: user.needsPasswordChange };
};

export const AuthServices = {
    loginUser,
};
