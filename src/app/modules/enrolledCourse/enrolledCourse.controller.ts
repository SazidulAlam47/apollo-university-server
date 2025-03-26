import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
    const { id } = req.user;
    const { offeredCourse } = req.body;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
        id,
        offeredCourse,
    );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Course enrolled successfully',
        data: result,
    });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course Marks updated successfully',
        data: result,
    });
});

const getMyEnrolledCourse = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await EnrolledCourseServices.getMyEnrolledCourseFromDB(
        id,
        req.query,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Enrolled Courses retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getFacultyCourse = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await EnrolledCourseServices.getFacultyCourseFromDB(
        id,
        req.query,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Enrolled Courses retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
    getMyEnrolledCourse,
    getFacultyCourse,
};
