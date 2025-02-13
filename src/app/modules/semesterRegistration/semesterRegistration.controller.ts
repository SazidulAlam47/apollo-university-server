import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
            req.body,
        );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Semester Registered successfully',
        data: result,
    });
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(
            req.query,
        );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'All Semester Registration retrieved successfully',
        data: result,
    });
});

const getSemesterRegistrationById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await SemesterRegistrationServices.getSemesterRegistrationByIdFromDB(
            id,
        );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Semester Registration retrieved successfully',
        data: result,
    });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
            id,
            req.body,
        );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Semester Registration updated successfully',
        data: result,
    });
});

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSemesterRegistrationById,
    updateSemesterRegistration,
};
