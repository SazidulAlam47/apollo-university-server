import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';

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

    // update primitive Data
    const updatedPrimitiveData = await Course.findByIdAndUpdate(
        id,
        primitiveData,
        {
            new: true,
            runValidators: true,
        },
    );

    if (preRequisiteCourses && preRequisiteCourses.length) {
        // delete
        const deletingPreRequisiteIds = preRequisiteCourses
            .filter((el) => el.course && el.isDeleted)
            .map((el) => el.course);

        await Course.findByIdAndUpdate(
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
            },
        );

        // add
        const newPreRequisite = preRequisiteCourses.filter(
            (el) => el.course && !el.isDeleted,
        );

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
            },
        );

        return newPreRequisiteCourses;
    }

    return updatedPrimitiveData;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getCourseByIdFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
};
