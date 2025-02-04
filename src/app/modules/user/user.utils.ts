import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { Student } from '../student/student.model';
import { User } from './user.model';

const findLastStudentId = async (year: string, code: string) => {
    const lastStudentArray = await Student.aggregate([
        {
            $lookup: {
                from: 'academicsemesters',
                localField: 'admissionSemester',
                foreignField: '_id',
                as: 'admissionSemester',
            },
        },
        {
            $unwind: '$admissionSemester',
        },
        {
            $match: {
                'admissionSemester.year': year,
                'admissionSemester.code': code,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                id: 1,
                _id: 0,
            },
        },
        {
            $limit: 1,
        },
    ]);

    const lastStudent = lastStudentArray[0];

    return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
    const currentId: string =
        (await findLastStudentId(payload.year, payload.code)) || '0000';
    let incrementId: string = (Number(currentId) + 1)
        .toString()
        .padStart(4, '0');
    incrementId = payload.year + payload.code + incrementId;
    return incrementId;
};

const findLastOfficialId = async (role: string) => {
    const lastUser = await User.findOne({ role })
        .sort({ createdAt: -1 })
        .lean();
    return lastUser?.id;
};

export const generateOfficialId = async (role: string) => {
    const currentId: string = (await findLastOfficialId(role)) || '0000';
    const incrementId: string = (Number(currentId) + 1)
        .toString()
        .padStart(4, '0');
    return incrementId;
};
