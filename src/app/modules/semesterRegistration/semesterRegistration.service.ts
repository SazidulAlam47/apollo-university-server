import { AcademicSemester } from './../academicSemester/academicSemester.model';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { registrationStatus } from './semesterRegistration.constant';
import { startSession } from 'mongoose';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';

const createSemesterRegistrationIntoDB = async (
    payload: TSemesterRegistration,
) => {
    // semester must be Upcoming
    payload.status = 'Upcoming';

    const academicSemester = payload?.academicSemester;

    // check if there any registered semester that is already 'Upcoming' or 'Ongoing'
    const isThereAnyUpcomingOrOngoing = await SemesterRegistration.findOne({
        status: {
            $in: [registrationStatus.Upcoming, registrationStatus.Ongoing],
        },
    });

    if (isThereAnyUpcomingOrOngoing) {
        throw new AppError(
            status.CONFLICT,
            `There is already an ${isThereAnyUpcomingOrOngoing.status} Registered Semester`,
        );
    }

    // if semester exists in DB
    const isAcademicSemesterExists =
        await AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExists) {
        throw new AppError(status.NOT_FOUND, 'Academic Semester not found!');
    }
    // if semester already registered
    const isSemesterRegistrationExists = await SemesterRegistration.findOne({
        academicSemester,
    });
    if (isSemesterRegistrationExists) {
        throw new AppError(status.CONFLICT, 'Semester is already registered!');
    }
    const result = await SemesterRegistration.create(payload);
    return result;
};

const getAllSemesterRegistrationFromDB = async (
    query: Record<string, unknown>,
) => {
    const populateSemesterRegistration =
        SemesterRegistration.find().populate('academicSemester');

    const semesterRegistrationQuery = new QueryBuilder(
        populateSemesterRegistration,
        query,
    )
        .paginate()
        .filter()
        .sort()
        .fields();

    const result = await semesterRegistrationQuery.modelQuery;
    return result;
};

const getSemesterRegistrationByIdFromDB = async (id: string) => {
    const result =
        await SemesterRegistration.findById(id).populate('academicSemester');
    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Semester Registration not found');
    }
    return result;
};

const updateSemesterRegistrationIntoDB = async (
    id: string,
    payload: Partial<TSemesterRegistration>,
) => {
    const registeredSemester = await SemesterRegistration.findById(id);
    const currentSemesterStatus = registeredSemester?.status;
    const requestedSemesterStatus = payload?.status;
    // is register semester exist in DB
    if (!registeredSemester) {
        throw new AppError(status.NOT_FOUND, 'Registered Semester Not found');
    }
    // if the requested semester registered is ended, we will not update anything
    if (currentSemesterStatus === 'Ended') {
        throw new AppError(
            status.BAD_REQUEST,
            'Registered Semester is already Ended',
        );
    }

    // directly "Upcoming" to "Ended" is not allowed
    if (
        currentSemesterStatus === 'Upcoming' &&
        requestedSemesterStatus === 'Ended'
    ) {
        throw new AppError(
            status.BAD_REQUEST,
            'Directly Upcoming to Ended is not allowed',
        );
    }
    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
    const deletedSemesterRegistration = await SemesterRegistration.findById(id);

    if (!deletedSemesterRegistration) {
        throw new AppError(status.NOT_FOUND, 'Semester Registration not found');
    }

    if (deletedSemesterRegistration.status !== registrationStatus.Upcoming) {
        throw new AppError(
            status.BAD_REQUEST,
            `Semester Registration can not be deleted because it is ${deletedSemesterRegistration.status}`,
        );
    }

    const session = await startSession();
    try {
        session.startTransaction();

        const result = await SemesterRegistration.findByIdAndDelete(id, {
            session,
        });

        if (!result) {
            throw new AppError(
                status.BAD_REQUEST,
                'Filed to delete Semester Registration',
            );
        }

        const deletedOfferedCourses = await OfferedCourse.deleteMany(
            {
                semesterRegistration: id,
            },
            { session },
        );

        if (!deletedOfferedCourses.acknowledged) {
            throw new AppError(
                status.BAD_REQUEST,
                'Filed to delete Offered Courses of this semester',
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return result;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        session.abortTransaction();
        session.endSession();
        throw new AppError(error.statusCode, error.message);
    }
};

export const SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSemesterRegistrationByIdFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB,
};
