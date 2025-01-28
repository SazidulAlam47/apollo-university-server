import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
    // if (await Student.isUserExists(studentData.id)) {
    //     throw new Error("User already exists.");
    // }

    // create a user
    const userData: Partial<TUser> = {
        password: password || (config.default_password as string),
        id: '201900001',
        role: 'student',
    };

    const newUser = await User.create(userData);

    //create a student
    if (Object.keys(newUser).length) {
        studentData.id = newUser.id;
        studentData.user = newUser._id;
    }

    const newStudent = await Student.create(studentData);

    return newStudent;
};

export const UserServices = {
    createStudentIntoDB,
};
