import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import {
    TCourse,
    TCourseFaculty,
    TPreRequisiteCourse,
} from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const populateCourse = Course.find().populate('preRequisiteCourses.course');
    const courseQuery = new QueryBuilder(populateCourse, query)
        .search(courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await courseQuery.modelQuery;
    return result;
};

const getCourseByIdFromDB = async (id: string) => {
    const result = await Course.findById(id).populate(
        'preRequisiteCourses.course',
    );
    return result;
};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...primitiveData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // update primitive Data
        const updatedPrimitiveData = await Course.findByIdAndUpdate(
            id,
            primitiveData,
            {
                new: true,
                runValidators: true,
                session,
            },
        );

        if (!updatedPrimitiveData) {
            throw new AppError(status.BAD_REQUEST, 'Failed to update course');
        }

        // update preRequisiteCourses
        if (preRequisiteCourses && preRequisiteCourses.length) {
            // delete
            const deletingPreRequisiteIds: Types.ObjectId[] =
                preRequisiteCourses
                    .filter((el) => el.course && el.isDeleted)
                    .map((el) => el.course);

            const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        preRequisiteCourses: {
                            course: { $in: deletingPreRequisiteIds },
                        },
                    },
                },
                {
                    new: true,
                    session,
                },
            );

            if (!deletedPreRequisiteCourses) {
                throw new AppError(
                    status.BAD_REQUEST,
                    'Failed to delete course',
                );
            }

            // add
            const newPreRequisite: TPreRequisiteCourse[] =
                preRequisiteCourses.filter((el) => el.course && !el.isDeleted);

            const newPreRequisiteCourses = await Course.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        preRequisiteCourses: {
                            $each: newPreRequisite,
                        },
                    },
                },
                {
                    new: true,
                    session,
                },
            );

            if (!newPreRequisiteCourses) {
                throw new AppError(status.BAD_REQUEST, 'Failed to add course');
            }

            await session.commitTransaction();
            await session.endSession();

            return newPreRequisiteCourses;
        }

        await session.commitTransaction();
        await session.endSession();

        return updatedPrimitiveData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

const assignFacultiesWithCourseIntoDB = async (
    id: string,
    payload: Partial<TCourseFaculty>,
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $set: {
                course: id,
            },
            $addToSet: {
                faculties: {
                    $each: payload.faculties,
                },
            },
        },
        {
            upsert: true,
            new: true,
        },
    );
    return result;
};

const removeFacultiesFromCourseFromDB = async (
    id: string,
    payload: Partial<TCourseFaculty>,
) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: {
                faculties: {
                    $in: payload.faculties,
                },
            },
        },
        {
            new: true,
        },
    );
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getCourseByIdFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseFromDB,
};
