import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All students are fetched successfully',
        data: result,
    });
});

const getStudentById = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getStudentByIdFromDB(studentId);
    if (!result) throw new AppError(status.NOT_FOUND, 'Student not found');

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Student is fetched successfully',
        data: result,
    });
});

const deleteStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.deleteUserFromDB(studentId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Student is deleted successfully',
        data: result,
    });
});

export const StudentControllers = {
    getAllStudents,
    getStudentById,
    deleteStudent,
};
