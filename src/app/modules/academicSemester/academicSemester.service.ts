import status from 'http-status';
import AppError from '../../errors/AppError';
import { academicSemesterNameCodeMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new AppError(status.CONFLICT, 'Invalid semester code');
    }

    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
    const semesterQuery = new QueryBuilder(AcademicSemester.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await semesterQuery.modelQuery;

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
        throw new AppError(
            status.CONFLICT,
            'Name and code both should be passed',
        );
    }
    if (
        payload.name &&
        payload.code &&
        academicSemesterNameCodeMapper[payload.name] !== payload.code
    ) {
        throw new AppError(status.CONFLICT, 'Invalid semester code');
    }
    const result = await AcademicSemester.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
        },
    );
    return result;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemesterFromDB,
    getAcademicSemesterByIdFromDB,
    updateAcademicSemesterByIdFromDB,
};
