import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { FacultyServices } from './faculty.service';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

const getAllFaculty = catchAsync(async (req, res) => {
    const result = await FacultyServices.getAllFacultyFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: 'All Faculty fetched successfully',
        data: result,
    });
});

const getFacultyById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.getFacultyByIdIntoDB(id);
    if (!result) throw new AppError(status.NOT_FOUND, 'Faculty not found');

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculty is fetched successfully',
        data: result,
    });
});

const updateFacultyById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { faculty } = req.body;
    const result = await FacultyServices.updateFacultyByIdIntoDB(id, faculty);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculty is updated successfully',
        data: result,
    });
});

const deleteFacultyById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await FacultyServices.deleteFacultyFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Faculty is deleted successfully',
        data: result,
    });
});

export const FacultyControllers = {
    getAllFaculty,
    getFacultyById,
    updateFacultyById,
    deleteFacultyById,
};
