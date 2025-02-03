import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.service';
import AppError from '../../errors/AppError';

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
        req.body,
    );

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Academic semester is created successfully',
        data: result,
    });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result =
        await AcademicSemesterServices.getAllAcademicSemesterFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All academic semesters fetched successfully',
        data: result,
    });
});

const getAcademicSemesterById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await AcademicSemesterServices.getAcademicSemesterByIdFromDB(id);

    if (!result)
        throw new AppError(status.NOT_FOUND, 'Academic Semester not found');
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic semester fetched successfully',
        data: result,
    });
});

const updateAcademicSemesterById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const result =
        await AcademicSemesterServices.updateAcademicSemesterByIdFromDB(
            id,
            body,
        );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic semester updated successfully',
        data: result,
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemester,
    getAcademicSemesterById,
    updateAcademicSemesterById,
};
