import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB(req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All students are fetched successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getStudentById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentServices.getStudentByIdFromDB(id);
    if (!result) throw new AppError(status.NOT_FOUND, 'Student not found');

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Student is fetched successfully',
        data: result,
    });
});

const deleteStudent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentServices.deleteUserFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Student is deleted successfully',
        data: result,
    });
});

const updateStudent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { student } = req.body;
    const result = await StudentServices.updateStudentIntoDB(
        id,
        student,
        req.file,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Student is updated successfully',
        data: result,
    });
});

export const StudentControllers = {
    getAllStudents,
    getStudentById,
    deleteStudent,
    updateStudent,
};
