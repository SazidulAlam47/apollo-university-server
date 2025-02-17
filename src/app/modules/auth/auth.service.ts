import status from 'http-status';
import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
    // if the user is exists
    const isUserExists = await User.findOne({ id: payload.id });

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, 'User not fund');
    }
    if (isUserExists.isDeleted) {
        throw new AppError(status.FORBIDDEN, 'User is deleted');
    }
    if (isUserExists.status === 'blocked') {
        throw new AppError(status.FORBIDDEN, 'User is blocked');
    }
    // checking password
    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        isUserExists.password,
    );
    if (!isPasswordMatched) {
        throw new AppError(status.FORBIDDEN, 'Password did not matched');
    }

    // Access granted: send access token, refresh token

    return {};
};

export const AuthServices = {
    loginUser,
};
