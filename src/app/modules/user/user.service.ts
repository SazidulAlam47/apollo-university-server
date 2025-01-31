import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import mongoose from 'mongoose';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    const admissionSemester = await AcademicSemester.findById(
        payload.admissionSemester,
    );

    if (!admissionSemester) {
        throw new AppError(status.NOT_FOUND, 'Admission Semester Not Found');
    }

    // generate student id
    const generatedId = await generateStudentId(admissionSemester);

    // create a user data
    const userData: Partial<TUser> = {
        password: password || (config.default_password as string),
        id: generatedId,
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

        //create a student (transaction-2)
        const newStudent = await Student.create([payload], { session });

        if (!newStudent.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to create student');
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

export const UserServices = {
    createStudentIntoDB,
};
