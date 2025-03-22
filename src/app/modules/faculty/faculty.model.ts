import { model, Schema } from 'mongoose';
import status from 'http-status';
import { TFaculty } from './faculty.interface';
import { userNameSchema } from '../user/user.model';
import AppError from '../../errors/AppError';

const facultySchema = new Schema<TFaculty>(
    {
        id: { type: String },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User',
        },
        designation: { type: String, require: true },
        name: { type: userNameSchema, require: true },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: true,
        },
        dateOfBirth: { type: Date, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        contactNumber: { type: String, required: true, unique: true },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        presentAddress: { type: String, required: true },
        permanentAddress: { type: String, required: true },
        profileImg: { type: String, default: '' },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'AcademicDepartment',
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'AcademicFaculty',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        timestamps: true,
    },
);

facultySchema.virtual('fullName').get(function () {
    return this?.name
        ? `${this?.name?.firstName} ${this?.name?.middleName || ''} ${this?.name?.lastName}`
        : undefined;
});

// Query Middleware,
facultySchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

facultySchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

facultySchema.pre('findOneAndUpdate', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

facultySchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

facultySchema.pre('save', async function (next) {
    const existingId = await Faculty.findOne({ id: this.id });
    if (existingId) {
        throw new AppError(status.CONFLICT, 'Faculty already exists');
    }

    const existingEmail = await Faculty.findOne({ email: this.email });
    if (existingEmail) {
        throw new AppError(status.CONFLICT, 'Email already exists');
    }

    const existingContactNumber = await Faculty.findOne({
        contactNumber: this.contactNumber,
    });
    if (existingContactNumber) {
        throw new AppError(status.CONFLICT, 'Contact Number already exists');
    }
    next();
});

export const Faculty = model<TFaculty>('Faculty', facultySchema);
