import { Schema, model } from "mongoose";
import validator from "validator";
import {
    TGuardian,
    TLocalGuardian,
    TStudent,
    TStudentModel,
    TUserName,
} from "./student.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [20, "First name is too long"],
        validate: {
            validator: function (value: string) {
                const firstNameStr =
                    value.charAt(0).toUpperCase() +
                    value.slice(1).toLowerCase();
                return value === firstNameStr;
            },
            message: "{VALUE} is not in Capitalize format",
        },
    },
    middleName: { type: String },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        validate: {
            validator: (value: string) => validator.isAlpha(value),
            message: "{VALUE} is not valid",
        },
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

const studentSchema = new Schema<TStudent, TStudentModel>({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, maxlength: 20 },
    name: { type: userNameSchema, required: true },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female"],
            message: "{VALUE} is not valid",
        },
        required: true,
    },
    dateOfBirth: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: "{VALUE} is not a valid email",
        },
    },
    contactNumber: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: { type: String },
    isActive: {
        type: String,
        enum: ["Active", "Blocked"],
        default: "Active",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

// for creating static method
studentSchema.statics.isUserExists = async function (id: string) {
    const existingUser = await Student.findOne({ id });
    return existingUser;
};

// studentSchema.static("isUserExists", async function (id: string) {
//     const existingUser = await Student.findOne({ id });
//     return existingUser;
// });

// for creating instance method

// studentSchema.methods.isUserExists = async function (id: string) {
//     const existingUser = await Student.findOne({ id });
//     return existingUser;
// };

// mongo hooks / middlewares

// document middlewares, this will run when calling create() or save()
studentSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_round),
    );
    next();
});

studentSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});

// Query Middleware,
studentSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

studentSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

studentSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

export const Student = model<TStudent, TStudentModel>("Student", studentSchema);
