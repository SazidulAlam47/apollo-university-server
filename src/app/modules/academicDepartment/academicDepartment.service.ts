import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartment.create(payload);
    return result;
};

const getAllAcademicDepartmentFromDB = async () => {
    const result = await AcademicDepartment.find();
    return result;
};

const getAcademicDepartmentByIdFromDB = async (id: string) => {
    const result = await AcademicDepartment.findById(id);
    return result;
};

const updateAcademicDepartmentByIdFromDB = async (
    id: string,
    payload: TAcademicDepartment,
) => {
    const result = await AcademicDepartment.updateOne({ _id: id }, payload, {
        new: true,
    });
    return result;
};

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentFromDB,
    getAcademicDepartmentByIdFromDB,
    updateAcademicDepartmentByIdFromDB,
};
