/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicSemester } from '../academicSemester/academicSemester.model';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const populateStudents = Student.find().populate(
        'admissionSemester academicDepartment academicFaculty user',
    );
    const studentQuery = new QueryBuilder(populateStudents, query)
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await studentQuery.modelQuery;
    const meta = await studentQuery.countTotal();

    return { meta, result };
};

const getStudentByIdFromDB = async (id: string) => {
    const result = await Student.findById(id).populate(
        'admissionSemester academicDepartment academicFaculty user',
    );
    return result;
};

const deleteUserFromDB = async (id: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const deletedStudent = await Student.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedStudent) {
            throw new AppError(status.NOT_FOUND, 'Student not found');
        }

        const userId = deletedStudent.user;

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

        return deletedStudent;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

const updateStudentIntoDB = async (
    id: string,
    payload: Partial<TStudent>,
    file: any,
) => {
    const { name, guardian, localGuardian, ...primitiveData } = payload;

    const { academicDepartment, admissionSemester } = primitiveData;

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

    if (admissionSemester) {
        const isAdmissionSemesterExists =
            await AcademicSemester.findById(admissionSemester);

        if (!isAdmissionSemesterExists) {
            throw new AppError(
                status.NOT_FOUND,
                'Admission Semester Not Found',
            );
        }
    }

    if (file) {
        const imgName = `${payload.id}-${new Date().getTime()}`;
        const imgPath = file?.path;
        const imgUrl = await sendImageToCloudinary(imgName, imgPath as string);
        primitiveData.profileImg = imgUrl;
    }

    delete primitiveData.email;

    const modifiedData: Record<string, unknown> = primitiveData;
    const nonPrimitiveData = { name, guardian, localGuardian };

    Object.entries(nonPrimitiveData).forEach(([field, data]) => {
        if (data && Object.keys(data).length) {
            Object.entries(data).forEach(([key, value]) => {
                modifiedData[`${field}.${key}`] = value;
            });
        }
    });

    const result = await Student.findByIdAndUpdate(id, modifiedData, {
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
