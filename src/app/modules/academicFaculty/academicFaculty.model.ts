import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';

const academicFacultySchema = new Schema<TAcademicFaculty>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

academicFacultySchema.pre('save', async function (next) {
    const isExists = await AcademicFaculty.findOne({
        name: this.name,
    });
    if (isExists) {
        throw new Error('This Faculty is already exists');
    }
    next();
});

academicFacultySchema.pre('updateOne', async function (next) {
    const isExists = await AcademicFaculty.findOne(this.getQuery());
    if (!isExists) {
        throw new Error("This Faculty is doesn't exists");
    }
    next();
});

export const AcademicFaculty = model<TAcademicFaculty>(
    'AcademicFaculty',
    academicFacultySchema,
);
