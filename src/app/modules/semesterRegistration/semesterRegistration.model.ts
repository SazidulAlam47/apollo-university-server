import { model, Schema } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { semesterRegistrationStatus } from './semesterRegistration.constant';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
    {
        academicSemester: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicSemester',
            unique: true,
            required: true,
        },
        status: {
            type: String,
            enum: semesterRegistrationStatus,
            default: 'Upcoming',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        minCredit: {
            type: Number,
            default: 3,
        },
        maxCredit: {
            type: Number,
            default: 16,
        },
    },
    {
        timestamps: true,
    },
);

export const semesterRegistration = model<TSemesterRegistration>(
    'semesterRegistration',
    semesterRegistrationSchema,
);
