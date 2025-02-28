/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { Student } from '../student/student.model';
import EnrolledCourse from './enrolledCourse.model';
import mongoose from 'mongoose';
import { TEnrolledCourse } from './enrolledCourse.interface';

const createEnrolledCourseIntoDB = async (
    userId: string,
    offeredCourseId: string,
) => {
    const isOfferedCourseExists = await OfferedCourse.findById(offeredCourseId);

    if (!isOfferedCourseExists) {
        throw new AppError(status.NOT_FOUND, 'Offered Course not found');
    }

    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError(status.CONFLICT, 'Room is full');
    }

    const student = await Student.findOne({ id: userId }).select('_id');

    const isStudentEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        offeredCourse: offeredCourseId,
        student: student?._id,
    });

    if (isStudentEnrolled) {
        throw new AppError(status.CONFLICT, 'Student is already enrolled');
    }

    const payload: Partial<TEnrolledCourse> = {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        academicSemester: isOfferedCourseExists.academicSemester,
        academicFaculty: isOfferedCourseExists.academicFaculty,
        academicDepartment: isOfferedCourseExists.academicDepartment,
        offeredCourse: new mongoose.Types.ObjectId(offeredCourseId),
        course: isOfferedCourseExists.course,
        student: student?._id,
        faculty: isOfferedCourseExists.faculty,
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

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
};
