import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import AppError from '../../errors/AppError';

const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Course created successfully',
        data: result,
    });
});

const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All Course fetched successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getCourseById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getCourseByIdFromDB(id);
    if (!result) throw new AppError(status.NOT_FOUND, 'Course not found');
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course fetched successfully',
        data: result,
    });
});

const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course deleted successfully',
        data: result,
    });
});

const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Course updated successfully',
        data: result,
    });
});

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const result = await CourseServices.assignFacultiesWithCourseIntoDB(
        courseId,
        req.body,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculties assigned successfully',
        data: result,
    });
});

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const result = await CourseServices.removeFacultiesFromCourseFromDB(
        courseId,
        req.body,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculties removed successfully',
        data: result,
    });
});

const getFacultiesOfCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const result = await CourseServices.getFacultiesOfCourseFromDB(courseId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculties of the Course are retrieved successfully',
        data: result,
    });
});

export const CourseControllers = {
    createCourse,
    getAllCourses,
    getCourseById,
    deleteCourse,
    updateCourse,
    assignFacultiesWithCourse,
    removeFacultiesFromCourse,
    getFacultiesOfCourse,
};
