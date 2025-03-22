/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { adminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { User } from '../user/user.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
    const adminPopulate = Admin.find().populate('name user');
    const adminQuery = new QueryBuilder(adminPopulate, query)
        .search(adminSearchableFields)
        .filter()
        .paginate()
        .sort()
        .fields();

    const result = await adminQuery.modelQuery;
    const meta = await adminQuery.countTotal();

    return { meta, result };
};

const getAdminByIdIntoDB = async (id: string) => {
    const result = await Admin.findById(id).populate('name user');
    return result;
};

const updateAdminByIdIntoDB = async (
    id: string,
    payload: Partial<TAdmin>,
    file: any,
) => {
    const { name, ...primitiveData } = payload;

    if (file) {
        const imgName = `${payload.id}-${new Date().getTime()}`;
        const imgPath = file?.path;
        const imgUrl = await sendImageToCloudinary(imgName, imgPath as string);
        primitiveData.profileImg = imgUrl;
    }

    delete primitiveData?.email;

    const modifiedData: Record<string, unknown> = primitiveData;
    const nonPrimitiveData = { name };

    Object.entries(nonPrimitiveData).forEach(([field, data]) => {
        if (data && Object.keys(data).length) {
            Object.entries(data).forEach(([key, value]) => {
                modifiedData[`${field}.${key}`] = value;
            });
        }
    });

    const result = await Admin.findByIdAndUpdate(id, modifiedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteAdminFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deletedAdmin = await Admin.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedAdmin) {
            throw new AppError(status.NOT_FOUND, 'Admin not found');
        }

        const userId = deletedAdmin.user;

        const deletedUser = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true, session },
        );
        if (!deletedUser) {
            throw new AppError(status.NOT_FOUND, 'User not found');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedAdmin;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

export const AdminServices = {
    getAllAdminFromDB,
    getAdminByIdIntoDB,
    updateAdminByIdIntoDB,
    deleteAdminFromDB,
};
