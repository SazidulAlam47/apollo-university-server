import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyServices } from './academicFaculty.service';
import AppError from '../../errors/AppError';

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
        req.body,
    );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Academic Faculty created successfully',
        data: result,
    });
});

const getAllAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB(
        req.query,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All Academic Faculty fetched successfully',
        data: result,
    });
});

const getAcademicFacultyById = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAcademicFacultyByIdFromDB(
        req.params.id,
    );
    if (!result)
        throw new AppError(status.NOT_FOUND, 'Academic Faculty not found');
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Faculty fetched successfully',
        data: result,
    });
});

const updateAcademicFacultyById = catchAsync(async (req, res) => {
    const result =
        await AcademicFacultyServices.updateAcademicFacultyByIdFromDB(
            req.params.id,
            req.body,
        );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Faculty updated successfully',
        data: result,
    });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getAcademicFacultyById,
    updateAcademicFacultyById,
};
