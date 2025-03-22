import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';
import AppError from '../../errors/AppError';

const getAllAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: 'All Admin fetched successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getAdminById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.getAdminByIdIntoDB(id);
    if (!result) throw new AppError(status.NOT_FOUND, 'Admin not found');

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Admin is fetched successfully',
        data: result,
    });
});

const updateAdminById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { admin } = req.body;
    const result = await AdminServices.updateAdminByIdIntoDB(
        id,
        admin,
        req.file,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Admin is updated successfully',
        data: result,
    });
});

const deleteAdminById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.deleteAdminFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Admin is deleted successfully',
        data: result,
    });
});

export const AdminControllers = {
    getAllAdmin,
    getAdminById,
    updateAdminById,
    deleteAdminById,
};
