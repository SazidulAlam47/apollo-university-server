import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(
        req.body,
    );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Offered Course is created successfully',
        data: result,
    });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Offered Course is updated successfully',
        data: result,
    });
});

const getAllOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getAllOfferedCourseFromDB(
        req.query,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All Offered Course are retrieved successfully',
        data: result,
    });
});

const getOfferedCourseById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getOfferedCourseByIdFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Offered Course is retrieved successfully',
        data: result,
    });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseIntoDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Offered Course is deleted successfully',
        data: result,
    });
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
        id,
        req.query,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Offered Courses retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});

export const OfferedCourseControllers = {
    createOfferedCourse,
    updateOfferedCourse,
    getAllOfferedCourse,
    getOfferedCourseById,
    deleteOfferedCourse,
    getMyOfferedCourses,
};
