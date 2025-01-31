import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
    const admissionSemester = await AcademicSemester.findById(
        payload.admissionSemester,
    );

    if (!admissionSemester) {
        throw new AppError(status.NOT_FOUND, 'Admission Semester Not Found');
    }

    const generatedId = await generateStudentId(admissionSemester);

    // create a user
    const userData: Partial<TUser> = {
        password: password || (config.default_password as string),
        id: generatedId,
        role: 'student',
    };

    const newUser = await User.create(userData);

    //create a student
    if (Object.keys(newUser).length) {
        payload.id = newUser.id;
        payload.user = newUser._id;
    }

    const newStudent = await Student.create(payload);

    return newStudent;
};

export const UserServices = {
    createStudentIntoDB,
};
