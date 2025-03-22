import { model, Schema } from 'mongoose';
import { userNameSchema } from '../user/user.model';
import { TAdmin } from './admin.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';

const adminSchema = new Schema<TAdmin>(
    {
        id: { type: String },
        user: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
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

adminSchema.virtual('fullName').get(function () {
    return this?.name
        ? `${this?.name?.firstName} ${this?.name?.middleName || ''} ${this?.name?.lastName}`
        : undefined;
});

// Query Middleware,
adminSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

adminSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

adminSchema.pre('findOneAndUpdate', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

adminSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

adminSchema.pre('save', async function (next) {
    const existingId = await Admin.findOne({ id: this.id });
    if (existingId) {
        throw new AppError(status.CONFLICT, 'Admin already exists');
    }

    const existingEmail = await Admin.findOne({ email: this.email });
    if (existingEmail) {
        throw new AppError(status.CONFLICT, 'Email already exists');
    }

    const existingContactNumber = await Admin.findOne({
        contactNumber: this.contactNumber,
    });
    if (existingContactNumber) {
        throw new AppError(status.CONFLICT, 'Contact Number already exists');
    }
    next();
});

export const Admin = model<TAdmin>('Admin', adminSchema);
