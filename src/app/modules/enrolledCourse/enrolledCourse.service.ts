/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { Student } from '../student/student.model';
import EnrolledCourse from './enrolledCourse.model';
import mongoose from 'mongoose';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';

const createEnrolledCourseIntoDB = async (
    userId: string,
    offeredCourseId: string,
) => {
    const offeredCourse = await OfferedCourse.findById(offeredCourseId);

    if (!offeredCourse) {
        throw new AppError(status.NOT_FOUND, 'Offered Course not found');
    }

    if (offeredCourse.maxCapacity <= 0) {
        throw new AppError(status.CONFLICT, 'Room is full');
    }

    const student = await Student.findOne({ id: userId }, { _id: 1 });

    if (!student) {
        throw new AppError(status.NOT_FOUND, 'Student not found');
    }

    const isStudentEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: offeredCourse.semesterRegistration,
        offeredCourse: offeredCourseId,
        student: student?._id,
    });

    if (isStudentEnrolled) {
        throw new AppError(status.CONFLICT, 'Student is already enrolled');
    }

    // check max credit
    const semesterRegistration = await SemesterRegistration.findById(
        offeredCourse.semesterRegistration,
        { maxCredit: 1 },
    );

    if (!semesterRegistration) {
        throw new AppError(status.NOT_FOUND, 'Semester registration not found');
    }

    const enrolledCourses = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: offeredCourse.semesterRegistration,
                student: student?._id,
                isEnrolled: true,
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
            $group: {
                _id: null,
                totalEnrolledCredits: {
                    $sum: '$course.credits',
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1,
            },
        },
    ]);
    const course = await Course.findById(offeredCourse.course, {
        credits: 1,
    });
    if (!course) {
        throw new AppError(status.NOT_FOUND, 'Course not found');
    }

    const totalEnrolledCredits: number =
        enrolledCourses.length && enrolledCourses[0].totalEnrolledCredits
            ? enrolledCourses[0].totalEnrolledCredits
            : 0;
    const currentCourseCredit: number = course.credits;
    const maxCredit: number = semesterRegistration.maxCredit;

    if (totalEnrolledCredits + currentCourseCredit > maxCredit) {
        throw new AppError(status.BAD_REQUEST, 'Credit limit exceeded');
    }

    const payload: Partial<TEnrolledCourse> = {
        semesterRegistration: offeredCourse.semesterRegistration,
        academicSemester: offeredCourse.academicSemester,
        academicFaculty: offeredCourse.academicFaculty,
        academicDepartment: offeredCourse.academicDepartment,
        offeredCourse: new mongoose.Types.ObjectId(offeredCourseId),
        course: offeredCourse.course,
        student: student?._id,
        faculty: offeredCourse.faculty,
        isEnrolled: true,
    };

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const result = await EnrolledCourse.create([payload], { session });

        if (!result.length) {
            throw new AppError(status.BAD_REQUEST, 'Failed to enroll');
        }

        const decreaseCapacity = await OfferedCourse.findByIdAndUpdate(
            offeredCourseId,
            {
                $inc: { maxCapacity: -1 },
            },
            {
                session,
                new: true,
            },
        );

        if (!decreaseCapacity) {
            throw new AppError(status.BAD_REQUEST, 'Failed to enroll');
        }

        await session.commitTransaction();
        await session.endSession();
        return result[0];
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(err.statusCode, err.message);
    }
};

const updateEnrolledCourseMarksIntoDB = async (
    id: string,
    payload: Partial<TEnrolledCourse>,
) => {
    const faculty = await Faculty.findOne({ id }, { _id: 1 });

    if (!faculty) {
        throw new AppError(status.UNAUTHORIZED, 'Unauthorized access');
    }

    const { semesterRegistration, offeredCourse, student, courseMarks } =
        payload;

    const isSemesterRegistrationExists =
        await SemesterRegistration.findById(semesterRegistration);

    if (!isSemesterRegistrationExists) {
        throw new AppError(status.NOT_FOUND, 'Semester Registration not found');
    }

    const isStudentExists = await Student.findById(student);

    if (!isStudentExists) {
        throw new AppError(status.NOT_FOUND, 'Student not found');
    }

    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

    if (!isOfferedCourseExists) {
        throw new AppError(status.NOT_FOUND, 'Offered Course not found');
    }

    const isEnrolledCourseExists = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id,
    });

    if (!isEnrolledCourseExists) {
        throw new AppError(status.FORBIDDEN, 'Forbidden access');
    }

    const modifiedData: Record<string, unknown> = {};

    if (courseMarks && Object.keys(courseMarks).length) {
        Object.entries(courseMarks).forEach(([key, value]) => {
            modifiedData[`courseMarks.${key}`] = value;
        });
    }

    if (courseMarks?.finalTerm) {
        const { classTest1, classTest2, midTerm, finalTerm } =
            isEnrolledCourseExists.courseMarks;

        const totalMarks =
            (courseMarks.classTest1 || classTest1) +
            (courseMarks.classTest2 || classTest2) +
            (courseMarks.midTerm || midTerm) +
            (courseMarks.finalTerm || finalTerm);

        const courseResult = calculateGradeAndPoints(totalMarks);

        modifiedData.grade = courseResult.grade;
        modifiedData.gradePoints = courseResult.gradePoints;
        modifiedData.isCompleted = true;
    }

    const result = await EnrolledCourse.findByIdAndUpdate(
        isEnrolledCourseExists._id,
        modifiedData,
        { new: true },
    );

    return result;
};

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseMarksIntoDB,
};
