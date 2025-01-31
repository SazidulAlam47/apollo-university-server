import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.service';
import AppError from '../../errors/AppError';

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.createAcademicDepartmentIntoDB(
            req.body,
        );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Academic Department created successfully',
        data: result,
    });
});

const getAllAcademicDepartment = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All Academic Department fetched successfully',
        data: result,
    });
});

const getAcademicDepartmentById = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.getAcademicDepartmentByIdFromDB(
            req.params.id,
        );
    if (!result)
        throw new AppError(status.NOT_FOUND, 'Academic Department not found');
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Department fetched successfully',
        data: result,
    });
});

const updateAcademicDepartmentById = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.updateAcademicDepartmentByIdFromDB(
            req.params.id,
            req.body,
        );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Academic Department updated successfully',
        data: result,
    });
});

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getAcademicDepartmentById,
    updateAcademicDepartmentById,
};
