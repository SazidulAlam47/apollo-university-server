import { model, Schema } from 'mongoose';
import { userNameSchema } from '../user/user.model';
import { TAdmin } from './admin.interface';

const adminSchema = new Schema(
    {
        id: { type: String },
        user: { type: Schema.Types.ObjectId, require: true },
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
        profileImg: { type: String },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Admin = model<TAdmin>('Admin', adminSchema);
