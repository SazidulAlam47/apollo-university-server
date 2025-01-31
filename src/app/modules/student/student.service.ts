import { Student } from './student.model';

const getAllStudentsFromDB = async () => {
    const result = await Student.find()
        .populate('admissionSemester')
        .populate({
            path: 'academicDepartment',
            populate: {
                path: 'academicFaculty',
            },
        });
    return result;
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
    const result = await Student.updateOne({ id }, { isDeleted: true });
    return result;
};

export const StudentServices = {
    getAllStudentsFromDB,
    getStudentByIdFromDB,
    deleteUserFromDB,
};
