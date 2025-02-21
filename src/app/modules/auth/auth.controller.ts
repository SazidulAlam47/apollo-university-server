import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User is logged in successfully',
        data: result,
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

export const AuthControllers = {
    loginUser,
    changePassword,
};
