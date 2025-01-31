import { Schema, model } from 'mongoose';
import {
    TGuardian,
    TLocalGuardian,
    TStudent,
    TStudentModel,
    TUserName,
} from './student.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [20, 'First name is too long'],
        validate: {
            validator: function (value: string) {
                const firstNameStr =
                    value.charAt(0).toUpperCase() +
                    value.slice(1).toLowerCase();
                return value === firstNameStr;
            },
            message: '{VALUE} is not in Capitalize format',
        },
    },
    middleName: { type: String },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
});

const guardianSchema = new Schema<TGuardian>({
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContact: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContact: { type: String, required: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, TStudentModel>(
    {
        id: { type: String, required: true, unique: true },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User',
        },
        name: { type: userNameSchema, required: true },
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
        emergencyContact: { type: String, required: true },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        presentAddress: { type: String, required: true },
        permanentAddress: { type: String, required: true },
        guardian: { type: guardianSchema, required: true },
        localGuardian: { type: localGuardianSchema, required: true },
        profileImg: { type: String },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicDepartment',
            required: true,
        },
        admissionSemester: {
            type: Schema.Types.ObjectId,
            ref: 'AcademicSemester',
            required: true,
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

// virtual
studentSchema.virtual('fullName').get(function () {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// for creating static method
studentSchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id });
    return existingUser;
};

// Query Middleware,
studentSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

studentSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

studentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

studentSchema.pre('save', async function (next) {
    const existingId = await Student.findOne({ id: this.id });
    if (existingId) {
        throw new AppError(status.CONFLICT, 'Student already exists');
    }

    const academicDepartment = await AcademicDepartment.findById(
        this.academicDepartment,
    );
    if (!academicDepartment) {
        throw new AppError(status.NOT_FOUND, 'Academic Department Not Found');
    }

    const existingEmail = await Student.findOne({ email: this.email });
    if (existingEmail) {
        throw new AppError(status.CONFLICT, 'Email already exists');
    }

    const existingContactNumber = await Student.findOne({
        contactNumber: this.contactNumber,
    });
    if (existingContactNumber) {
        throw new AppError(status.CONFLICT, 'Contact Number already exists');
    }
    next();
});

export const Student = model<TStudent, TStudentModel>('Student', studentSchema);
