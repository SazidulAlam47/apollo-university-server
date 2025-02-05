import { Types } from 'mongoose';
import { TUserName } from '../user/user.interface';

export interface TFaculty {
    id: string;
    user: Types.ObjectId;
    designation: string;
    name: TUserName;
    gender: 'Male' | 'Female';
    dateOfBirth: Date;
    email: string;
    contactNumber: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress: string;
    permanentAddress: string;
    profileImg?: string;
    academicDepartment: Types.ObjectId;
    isDeleted: boolean;
}
