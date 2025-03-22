/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import status from 'http-status';
import { Faculty } from './faculty.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import { TFaculty } from './faculty.interface';
import { facultySearchableFields } from './faculty.constant';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
    const facultyPopulate = Faculty.find().populate(
        'academicDepartment academicFaculty user',
    );
    const facultyQuery = new QueryBuilder(facultyPopulate, query)
        .search(facultySearchableFields)
        .filter()
        .paginate()
        .sort()
        .fields();

    const result = await facultyQuery.modelQuery;
    const meta = await facultyQuery.countTotal();

    return { meta, result };
};

const getFacultyByIdIntoDB = async (id: string) => {
    const result = await Faculty.findById(id).populate(
        'academicDepartment academicFaculty user',
    );
    return result;
};

const updateFacultyByIdIntoDB = async (
    id: string,
    payload: Partial<TFaculty>,
    file: any,
) => {
    const { name, ...primitiveData } = payload;

    const { academicDepartment } = primitiveData;
    if (academicDepartment) {
        const isAcademicDepartmentExists =
            await AcademicDepartment.findById(academicDepartment);

        if (!isAcademicDepartmentExists) {
            throw new AppError(
                status.NOT_FOUND,
                'Academic Department Not Found',
            );
        }
        primitiveData.academicFaculty =
            isAcademicDepartmentExists.academicFaculty;
    }

    if (file) {
        const imgName = `${payload.id}-${new Date().getTime()}`;
        const imgPath = file?.path;
        const imgUrl = await sendImageToCloudinary(imgName, imgPath as string);
        primitiveData.profileImg = imgUrl;
    }

    delete primitiveData.email;

    const modifiedData: Record<string, unknown> = primitiveData;
    const nonPrimitiveData = { name };

    Object.entries(nonPrimitiveData).forEach(([field, data]) => {
        if (data && Object.keys(data).length) {
            Object.entries(data).forEach(([key, value]) => {
                modifiedData[`${field}.${key}`] = value;
            });
        }
    });

    const result = await Faculty.findByIdAndUpdate(id, modifiedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteFacultyFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deletedFaculty = await Faculty.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedFaculty) {
            throw new AppError(status.NOT_FOUND, 'Faculty not found');
        }

        const userId = deletedFaculty.user;

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

        return deletedFaculty;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

export const FacultyServices = {
    getAllFacultyFromDB,
    getFacultyByIdIntoDB,
    updateFacultyByIdIntoDB,
    deleteFacultyFromDB,
};
