import bcrypt from 'bcrypt';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import ms from 'ms';
import { sendEmail } from '../../utils/sendEmail';

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

const refreshToken = async (refreshToken: string) => {
    // check the token is valid
    const decoded = verifyToken(
        refreshToken,
        config.jwt_refresh_secret as string,
    );

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

    const jwtPayload = { id, role };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as ms.StringValue,
    );

    return { accessToken };
};

const forgetPassword = async (id: string) => {
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

    const jwtPayload = {
        id: user.id,
        role: user.role,
    };

    const resetToken = createToken(
        jwtPayload,
        config.jwt_reset_secret as string,
        '10m',
    );

    const resetLink = `${config.client_url}/reset-password?id=${user.id}&token=${resetToken}`;

    const subject = 'Reset Password';
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
            <p>Hello ${user.id},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>If you didn’t request this, you can safely ignore this email.</p>
            <p>Regards,</p>
            <p><strong>Apollo University</strong></p>
        </div>
        `;

    await sendEmail(user.email, subject, htmlBody);

    return null;
};

const resetPassword = async (
    tokenBearer: string | undefined,
    id: string | undefined,
    password: string,
) => {
    if (!id) {
        throw new AppError(status.FORBIDDEN, 'Forbidden access');
    }

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

    if (!tokenBearer) {
        throw new AppError(status.FORBIDDEN, 'Forbidden access');
    }
    const token = tokenBearer.split(' ')[1]; // Extract token after "Bearer"
    if (!token) {
        throw new AppError(status.FORBIDDEN, 'Forbidden access');
    }
    // check the token is valid
    const decoded = verifyToken(token, config.jwt_reset_secret as string);

    if (id !== decoded.id) {
        throw new AppError(status.FORBIDDEN, 'Forbidden access');
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_round),
    );

    await User.findOneAndUpdate(
        {
            id: decoded.id,
            role: decoded.role,
        },
        {
            password: hashedPassword,
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
    refreshToken,
    forgetPassword,
    resetPassword,
};
