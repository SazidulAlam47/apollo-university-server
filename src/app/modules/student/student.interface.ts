/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { TUserName } from '../user/user.interface';
export interface TGuardian {
    fatherName: string;
    fatherOccupation: string;
    fatherContact: string;
    motherName: string;
    motherOccupation: string;
    motherContact: string;
}

export interface TLocalGuardian {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
}

export interface TStudent {
    id: string;
    user: Types.ObjectId;
    name: TUserName;
    gender: 'Male' | 'Female';
    dateOfBirth: Date;
    email: string;
    contactNumber: string;
    emergencyContact: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress: string;
    permanentAddress: string;
    guardian: TGuardian;
    localGuardian: TLocalGuardian;
    profileImg?: string;
    academicDepartment: Types.ObjectId;
    admissionSemester: Types.ObjectId;
    isDeleted: boolean;
}

export interface TStudentModel extends Model<TStudent> {
    isUserExists(id: string): Promise<TStudent | null>;
}
