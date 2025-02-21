import bcrypt from 'bcrypt';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken } from './auth.utils';
import ms from 'ms';

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

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as ms.StringValue,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as ms.StringValue,
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user.needsPasswordChange,
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    const user = await User.isUserExistsByCustomId(userData.id);

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
    if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
        throw new AppError(status.FORBIDDEN, 'Password did not matched');
    }

    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_round),
    );

    await User.findOneAndUpdate(
        {
            id: userData.id,
            role: userData.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
        {
            new: true,
        },
    );
    return null;
};

export const AuthServices = {
    loginUser,
    changePassword,
};
