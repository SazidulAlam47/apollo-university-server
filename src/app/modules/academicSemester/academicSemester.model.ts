import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
    academicSemesterCodes,
    academicSemesterNames,
    months,
} from './academicSemester.constants';

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
            type: Date,
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

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemesterSchema,
);
