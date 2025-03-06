/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { generateOfficialId, generateStudentId } from './user.utils';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import mongoose from 'mongoose';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { UserRole } from './user.constant';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

const createStudentIntoDB = async (
    password: string,
    payload: TStudent,
    file: any,
) => {
    const admissionSemester = await AcademicSemester.findById(
        payload.admissionSemester,
    );

    if (!admissionSemester) {
        throw new AppError(status.NOT_FOUND, 'Admission Semester Not Found');
    }

    const academicDepartment = await AcademicDepartment.findById(
        payload.academicDepartment,
    );
    if (!academicDepartment) {
        throw new AppError(status.NOT_FOUND, 'Academic Department Not Found');
    }

    payload.academicFaculty = academicDepartment.academicFaculty;

    // generate student id
    const generatedId: string = await generateStudentId(admissionSemester);

    // create a user data
    const userData: Partial<TUser> = {
        id: generatedId,
        email: payload.email,
        password: password || (config.default_password as string),
        role: 'student',
    };

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        // create a user (transaction-1)
        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create user');
        }

        // reference and embed
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        // send image to cloudinary and add to url
        if (file) {
            const imgName = `${generatedId}${payload.name.firstName}`;
            const imgPath = file?.path;
            const imgUrl = await sendImageToCloudinary(
                imgName,
                imgPath as string,
            );
            payload.profileImg = imgUrl;
        }

        //create a student (transaction-2)
        const newStudent = await Student.create([payload], { session });

        if (!newStudent.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create student');
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent[0];
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

const createAdminIntoDB = async (
    password: string,
    payload: TAdmin,
    file: any,
) => {
    const generatedId: string = await generateOfficialId('admin');

    const userData: Partial<TUser> = {
        id: generatedId,
        email: payload.email,
        password: password || (config.default_password as string),
        role: 'admin',
    };

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create user');
        }

        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        // send image to cloudinary and add to url
        if (file) {
            const imgName = `${generatedId}${payload.name.firstName}`;
            const imgPath = file?.path;
            const imgUrl = await sendImageToCloudinary(
                imgName,
                imgPath as string,
            );
            payload.profileImg = imgUrl;
        }

        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create admin');
        }
        await session.commitTransaction();
        await session.endSession();

        return newAdmin[0];
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

const createFacultyIntoDB = async (
    password: string,
    payload: TFaculty,
    file: any,
) => {
    const generatedId: string = await generateOfficialId('faculty');

    const userData: Partial<TUser> = {
        id: generatedId,
        email: payload.email,
        password: password || (config.default_password as string),
        role: 'faculty',
    };

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const newUser = await User.create([userData], { session });

        if (!newUser.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create user');
        }

        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        // send image to cloudinary and add to url
        if (file) {
            const imgName = `${generatedId}${payload.name.firstName}`;
            const imgPath = file?.path;
            const imgUrl = await sendImageToCloudinary(
                imgName,
                imgPath as string,
            );
            payload.profileImg = imgUrl;
        }

        const newFaculty = await Faculty.create([payload], { session });

        if (!newFaculty) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create faculty');
        }
        await session.commitTransaction();
        await session.endSession();

        return newFaculty[0];
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

const getMeFromDB = async (id: string, role: string) => {
    let result = null;
    if (role === UserRole.student) {
        result = await Student.findOne({ id })
            .populate('admissionSemester')
            .populate({
                path: 'academicDepartment',
                populate: {
                    path: 'academicFaculty',
                },
            });
    } else if (role === UserRole.faculty) {
        result = await Faculty.findOne({ id });
    } else if (role === UserRole.admin) {
        result = await Admin.findOne({ id });
    }

    return result;
};

const changeStatusIntoDB = async (id: string, status: string) => {
    const result = await User.findByIdAndUpdate(id, { status }, { new: true });
    return result;
};

export const UserServices = {
    createStudentIntoDB,
    createAdminIntoDB,
    createFacultyIntoDB,
    getMeFromDB,
    changeStatusIntoDB,
};
