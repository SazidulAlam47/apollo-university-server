import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
    academicSemesterCodes,
    academicSemesterNames,
    months,
} from './academicSemester.constants';
import AppError from '../../errors/AppError';
import status from 'http-status';

const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            enum: academicSemesterNames,
            required: true,
        },
        code: {
            type: String,
            enum: academicSemesterCodes,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        startMonth: {
            type: String,
            enum: months,
            required: true,
        },
        endMonth: {
            type: String,
            enum: months,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        name: this.name,
        year: this.year,
    });
    if (isSemesterExists) {
        throw new AppError(status.CONFLICT, 'Semester is already exists!');
    }
    next();
});

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemesterSchema,
);
