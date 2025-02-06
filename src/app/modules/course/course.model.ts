import { model, Schema } from 'mongoose';
import {
    TCourse,
    TCourseFaculty,
    TPreRequisiteCourse,
} from './course.interface';

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
        ref: 'Faculty',
    },
});

export const CourseFaculty = model<TCourseFaculty>(
    'CourseFaculty',
    courseFacultySchema,
);
