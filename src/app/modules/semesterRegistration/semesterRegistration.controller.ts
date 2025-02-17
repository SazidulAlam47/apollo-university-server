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
        message: 'Semester is Registered successfully',
        data: result,
    });
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
    const result =
        await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(
            req.query,
        );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All Semester Registration is retrieved successfully',
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
        statusCode: status.OK,
        success: true,
        message: 'Semester Registration is retrieved successfully',
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
        statusCode: status.OK,
        success: true,
        message: 'Semester Registration is updated successfully',
        data: result,
    });
});

const deleteSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Semester Registration is deleted successfully',
        data: result,
    });
});

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSemesterRegistrationById,
    updateSemesterRegistration,
    deleteSemesterRegistration,
};
