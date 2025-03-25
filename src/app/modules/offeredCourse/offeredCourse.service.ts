import { Types } from 'mongoose';
import { OfferedCourse } from './offeredCourse.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import { registrationStatus } from '../semesterRegistration/semesterRegistration.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { Student } from '../student/student.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const {
        semesterRegistration,
        academicFaculty,
        academicDepartment,
        course,
        faculty,
        section,
        days,
        startTime,
        endTime,
    } = payload;

    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError(status.NOT_FOUND, 'Semester Registration not found');
    }

    payload.academicSemester = isSemesterRegistrationExists.academicSemester;

    const isAcademicFacultyExists =
        await AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError(status.NOT_FOUND, 'Academic Faculty not found');
    }

    const isAcademicDepartmentExists =
        await AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError(status.NOT_FOUND, 'Academic Department not found');
    }

    // check if the department is belong to the faculty
    if (
        !isAcademicDepartmentExists.academicFaculty.equals(
            new Types.ObjectId(academicFaculty),
        )
    ) {
        throw new AppError(
            status.CONFLICT,
            `Department of ${isAcademicDepartmentExists.name} is not belong to Faculty of ${isAcademicFacultyExists.name}`,
        );
    }

    const isCourseExists = await Course.findById(course);
    if (!isCourseExists) {
        throw new AppError(status.NOT_FOUND, 'Course not found');
    }

    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(status.NOT_FOUND, 'Faculty not found');
    }

    // same course is already offered or not
    const isCourseAlreadyOffered = await OfferedCourse.findOne({
        semesterRegistration,
        course,
        section,
    });
    if (isCourseAlreadyOffered) {
        throw new AppError(
            status.CONFLICT,
            'Offered corse with same section is already exists!',
        );
    }

    // get the schedules of the Faculty
    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            status.CONFLICT,
            'This faculty is not available at that time. Choose another time or day',
        );
    }

    const result = await OfferedCourse.create(payload);
    return result;
};

const updateOfferedCourseIntoDB = async (
    id: string,
    payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
    const { faculty, days, startTime, endTime } = payload;

    const isOfferedCourseExists = await OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError(status.NOT_FOUND, 'Offered Corse not found');
    }

    const isFacultyExists = await Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError(status.NOT_FOUND, 'Faculty not found');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration);
    if (semesterRegistrationStatus?.status !== registrationStatus.Upcoming) {
        throw new AppError(
            status.NOT_ACCEPTABLE,
            `You can not update this Offered Course as the Semester is ${semesterRegistrationStatus?.status}`,
        );
    }

    const assignedSchedules = await OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
        _id: { $ne: id },
    }).select('days startTime endTime');

    const newSchedule = {
        days,
        startTime,
        endTime,
    };

    if (hasTimeConflict(assignedSchedules, newSchedule)) {
        throw new AppError(
            status.CONFLICT,
            'This faculty is not available at that time. Choose another time or day',
        );
    }

    const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
    const populateOfferedCourse = OfferedCourse.find().populate(
        'semesterRegistration academicSemester academicFaculty academicDepartment course faculty',
    );

    const OfferedCourseQuery = new QueryBuilder(populateOfferedCourse, query)
        .paginate()
        .filter()
        .fields()
        .sort();

    const result = await OfferedCourseQuery.modelQuery;
    const meta = await OfferedCourseQuery.countTotal();

    return { result, meta };
};

const getOfferedCourseByIdFromDB = async (id: string) => {
    const result = await OfferedCourse.findById(id).populate(
        'semesterRegistration academicSemester academicFaculty academicDepartment course faculty',
    );

    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Offered Course not found');
    }

    return result;
};

const deleteOfferedCourseIntoDB = async (id: string) => {
    const isOfferedCourseExists = await OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError(status.NOT_FOUND, 'Offered Corse not found');
    }

    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus =
        await SemesterRegistration.findById(semesterRegistration);
    if (semesterRegistrationStatus?.status !== registrationStatus.Upcoming) {
        throw new AppError(
            status.BAD_REQUEST,
            `You can not delete this Offered Course as it is ${semesterRegistrationStatus?.status}`,
        );
    }

    const result = await OfferedCourse.findByIdAndDelete(id);
    return result;
};

const getMyOfferedCoursesFromDB = async (
    id: string,
    query: Record<string, unknown>,
) => {
    const student = await Student.findOne({ id });
    if (!student) {
        throw new AppError(status.NOT_FOUND, 'Student not found');
    }
    const currentOngoingSemesterRegistration =
        await SemesterRegistration.findOne({
            status: registrationStatus.Ongoing,
        });

    if (!currentOngoingSemesterRegistration) {
        throw new AppError(status.NOT_FOUND, 'There is no Ongoing Semester');
    }

    // pagination setup
    const page: number = parseInt(query?.page as string) || 1;
    const limit: number = parseInt(query?.limit as string) || 10;
    const skip: number = (page - 1) * limit;

    const mainAggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingSemesterRegistration._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingSemester:
                        currentOngoingSemesterRegistration._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$currentOngoingSemester',
                                        ],
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'complete',
                        in: '$$complete.course',
                    },
                },
            },
        },
        {
            $addFields: {
                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course',
                            },
                        },
                    ],
                },
                isPreRequisiteFulfilled: {
                    $or: [
                        {
                            $eq: ['$course.preRequisiteCourses', []],
                        },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds',
                            ],
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisiteFulfilled: true,
            },
        },
        {
            $project: {
                enrolledCourses: 0,
                completedCourses: 0,
                completedCourseIds: 0,
                isAlreadyEnrolled: 0,
                isPreRequisiteFulfilled: 0,
            },
        },
    ];

    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];

    const result = await OfferedCourse.aggregate([
        ...mainAggregationQuery,
        ...paginationQuery,
    ]);
    const totalData: number = (
        await OfferedCourse.aggregate(mainAggregationQuery)
    ).length;
    const totalPage: number = Math.ceil(totalData / limit);

    return {
        meta: {
            page,
            limit,
            totalData,
            totalPage,
        },
        result,
    };
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    updateOfferedCourseIntoDB,
    getAllOfferedCourseFromDB,
    getOfferedCourseByIdFromDB,
    deleteOfferedCourseIntoDB,
    getMyOfferedCoursesFromDB,
};
