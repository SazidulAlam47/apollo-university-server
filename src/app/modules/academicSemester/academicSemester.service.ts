import { academicSemesterNameCodeMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid semester code');
    }

    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcademicSemesterFromDB = async () => {
    const result = await AcademicSemester.find();
    return result;
};

const getAcademicSemesterByIdFromDB = async (id: string) => {
    const result = await AcademicSemester.findById(id);
    return result;
};

const updateAcademicSemesterByIdFromDB = async (
    id: string,
    payload: TAcademicSemester,
) => {
    if ((payload.name && !payload.code) || (!payload.name && payload.code)) {
        throw new Error('Name and code both should be passed');
    }
    if (
        payload.name &&
        payload.code &&
        academicSemesterNameCodeMapper[payload.name] !== payload.code
    ) {
        throw new Error('Invalid semester code');
    }
    const result = await AcademicSemester.updateOne({ _id: id }, payload, {
        new: true,
    });
    return result;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getAcademicSemesterByIdFromDB,
    updateAcademicSemesterByIdFromDB,
};
