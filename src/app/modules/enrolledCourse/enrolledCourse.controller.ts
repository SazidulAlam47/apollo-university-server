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
        statusCode: status.CREATED,
        success: true,
        message: 'Enrolled Course updated successfully',
        data: result,
    });
});

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
};
