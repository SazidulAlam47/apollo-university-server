import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    // default
    const populateStudents = Student.find()
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty',
            },
        });

    // search
    const searchableFields: Array<string> = ['email', 'name.firstName'];
    const searchTerm: string = (query?.searchTerm as string) || '';
    const searchQuery = populateStudents.find({
        $or: searchableFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: 'i' },
        })),
    });

    // filter
    const queryObj: Record<string, unknown> = { ...query }; //copy
    const excludeFields: Array<string> = [
        'searchTerm',
        'sort',
        'limit',
        'page',
        'fields',
    ];
    excludeFields.forEach((el) => delete queryObj[el]);
    const filterStudents = searchQuery.find(queryObj);
    // console.log({ query, queryObj });

    // sort
    const sort: string = (query?.sort as string) || '-createdAt';
    const sortStudents = filterStudents.sort(sort);

    // page and limit
    const page: number = parseInt(query?.page as string) || 0;
    const limit: number = parseInt(query?.limit as string) || 0;
    const paginationStudents = sortStudents
        .skip((page - 1) * limit)
        .limit(limit);

    const fields: string = (query?.fields as string) || '-__v';
    const fieldsWithSpace: string = fields.split(',').join(' ');

    const fieldsStudents = await paginationStudents.select(fieldsWithSpace);

    return fieldsStudents;
};

const getStudentByIdFromDB = async (id: string) => {
    const result = await Student.findOne({ id })
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty',
            },
        });
    return result;
};

const deleteUserFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deletedStudent = await Student.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedStudent) {
            throw new AppError(status.NOT_FOUND, 'Student not found');
        }

        const deletedUser = await User.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session },
        );
        if (!deletedUser) {
            throw new AppError(status.NOT_FOUND, 'User not found');
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedStudent;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...primitiveData } = payload;

    const modifiedData: Record<string, unknown> = primitiveData;
    const nonPrimitiveData = { name, guardian, localGuardian };

    Object.entries(nonPrimitiveData).forEach(([field, data]) => {
        if (data && Object.keys(data).length) {
            Object.entries(data).forEach(([key, value]) => {
                modifiedData[`${field}.${key}`] = value;
            });
        }
    });

    const result = await Student.findOneAndUpdate({ id }, modifiedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

export const StudentServices = {
    getAllStudentsFromDB,
    getStudentByIdFromDB,
    deleteUserFromDB,
    updateStudentIntoDB,
};
