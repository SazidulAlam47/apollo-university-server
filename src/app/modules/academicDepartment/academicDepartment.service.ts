import QueryBuilder from '../../builder/QueryBuilder';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartment.create(payload);
    return result;
};

const getAllAcademicDepartmentFromDB = async (
    query: Record<string, unknown>,
) => {
    const academicDepartmentPopulate =
        AcademicDepartment.find().populate('academicFaculty');

    const academicDepartmentQuery = new QueryBuilder(
        academicDepartmentPopulate,
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicDepartmentQuery.modelQuery;

    return result;
};

const getAcademicDepartmentByIdFromDB = async (id: string) => {
    const result =
        await AcademicDepartment.findById(id).populate('academicFaculty');
    return result;
};

const updateAcademicDepartmentByIdFromDB = async (
    id: string,
    payload: TAcademicDepartment,
) => {
    const result = await AcademicDepartment.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
        },
    );
    return result;
};

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentFromDB,
    getAcademicDepartmentByIdFromDB,
    updateAcademicDepartmentByIdFromDB,
};
