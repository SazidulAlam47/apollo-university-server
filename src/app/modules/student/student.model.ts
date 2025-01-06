import { Schema, model } from 'mongoose';
import {
    Guardian,
    LocalGuardian,
    Student,
    UserName,
} from './student.interface';

const userNameSchema = new Schema<UserName>({
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
});

const guardianSchema = new Schema<Guardian>({
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContact: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContact: { type: String, required: true },
});

const localGuardianSchema = new Schema<LocalGuardian>({
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
});

const studentSchema = new Schema<Student>({
    id: { type: String, required: true },
    name: userNameSchema,
    gender: ['Male', 'Female'],
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    bloodGroup: { type: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: guardianSchema,
    localGuardian: localGuardianSchema,
    profileImg: { type: String },
    isActive: ['Active', 'Blocked'],
});

export const StudentModel = model<Student>('Student', studentSchema);
