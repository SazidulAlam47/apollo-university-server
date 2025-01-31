import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicFaculty',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

academicDepartmentSchema.pre('save', async function (next) {
    const isExists = await AcademicDepartment.findOne({
        name: this.name,
    });
    if (isExists) {
        throw new AppError(
            status.CONFLICT,
            'This Department is already exists',
        );
    }
    next();
});

academicDepartmentSchema.pre('updateOne', async function (next) {
    const isExists = await AcademicDepartment.findOne(this.getQuery());
    if (!isExists) {
        throw new AppError(
            status.NOT_FOUND,
            "This Department is doesn't exists",
        );
    }
    next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
    'AcademicDepartment',
    academicDepartmentSchema,
);
