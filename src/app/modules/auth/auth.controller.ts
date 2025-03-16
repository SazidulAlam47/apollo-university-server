import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);

    const { refreshToken, accessToken, needsPasswordChange } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User is logged in successfully',
        data: {
            accessToken,
            needsPasswordChange,
        },
    });
});

const logoutUser = catchAsync(async (req, res) => {
    res.clearCookie('refreshToken');
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User logged out successfully',
        data: null,
    });
});

const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Password is changed successfully',
        data: result,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const result = await AuthServices.refreshToken(req.cookies.refreshToken);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Access Token retrieved successfully',
        data: result,
    });
});

const forgetPassword = catchAsync(async (req, res) => {
    const { id } = req.body;
    const result = await AuthServices.forgetPassword(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Reset link is generated successfully',
        data: result,
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const { id, password } = req.body;
    const token = req.headers.authorization;
    const result = await AuthServices.resetPassword(token, id, password);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Password reset successful',
        data: result,
    });
});

export const AuthControllers = {
    loginUser,
    logoutUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
