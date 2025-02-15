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

    const newSchedules = {
        days,
        startTime,
        endTime,
    };

    assignedSchedules.forEach((schedule) => {
        const existingStartTime = new Date(
            `1970-01-01T${schedule.startTime}:00`,
        );
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}:00`);
        const newStartTime = new Date(
            `1970-01-01T${newSchedules.startTime}:00`,
        );
        const newEndTime = new Date(`1970-01-01T${newSchedules.endTime}:00`);

        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            throw new AppError(
                status.CONFLICT,
                'This faculty is not available at that time. Choose another time or day',
            );
        }
    });

    const result = await OfferedCourse.create(payload);
    return result;
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
};
