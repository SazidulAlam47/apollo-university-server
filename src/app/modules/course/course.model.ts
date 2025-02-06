import { model, Schema, UpdateQuery } from 'mongoose';
import {
    TCourse,
    TCourseFaculty,
    TPreRequisiteCourse,
} from './course.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { Faculty } from '../faculty/faculty.model';

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourse>(
    {
        course: { type: Schema.Types.ObjectId, ref: 'Course' },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: false,
    },
);

const courseSchema = new Schema<TCourse>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        prefix: {
            type: String,
            required: true,
        },
        code: {
            type: Number,
            required: true,
        },
        credits: {
            type: Number,
            required: true,
        },
        preRequisiteCourses: [preRequisiteCourseSchema],
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

export const Course = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
    course: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Course',
    },
    faculties: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Faculty',
    },
});

courseFacultySchema.pre('findOneAndUpdate', async function (next) {
    const courseId: string = this.getQuery()?._id;

    const update = this.getUpdate() as UpdateQuery<unknown>;

    const facultyIds: string[] =
        update?.$addToSet?.faculties?.$each ||
        update?.$pull?.faculties?.$in ||
        [];

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
        throw new AppError(status.NOT_FOUND, 'Course not found');
    }

    if (facultyIds.length) {
        const existingFaculties = await Faculty.find(
            {
                _id: { $in: facultyIds },
            },
            { _id: 1 },
        );

        if (facultyIds.length !== existingFaculties.length) {
            throw new AppError(status.NOT_FOUND, 'Faculties not found');
        }
    }

    next();
});

export const CourseFaculty = model<TCourseFaculty>(
    'CourseFaculty',
    courseFacultySchema,
);
