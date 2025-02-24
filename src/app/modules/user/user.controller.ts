import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
    const { password, student } = req.body;

    const result = await UserServices.createStudentIntoDB(password, student);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Student created successfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin } = req.body;

    const result = await UserServices.createAdminIntoDB(password, admin);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Admin created successfully',
        data: result,
    });
});

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty } = req.body;

    const result = await UserServices.createFacultyIntoDB(password, faculty);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Faculty created successfully',
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const { id, role } = req.user;
    const result = await UserServices.getMeFromDB(id, role);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

const changeStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserServices.changeStatusIntoDB(id, req.body.status);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Status updated successfully',
        data: result,
    });
});

export const UserControllers = {
    createStudent,
    createAdmin,
    createFaculty,
    getMe,
    changeStatus,
};
