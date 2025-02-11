import { Types } from 'mongoose';

export interface TSemesterRegistration {
    academicSemester: Types.ObjectId;
    status: 'Upcoming' | 'Ongoing' | 'Ended';
    startDate: Date;
    endDate: Date;
    minCredit: number;
    maxCredit: number;
}
