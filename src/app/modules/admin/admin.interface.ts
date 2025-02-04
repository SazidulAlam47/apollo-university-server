import { Types } from 'mongoose';
import { TUserName } from '../user/user.interface';

export interface TAdmin {
    id: string;
    user: Types.ObjectId;
    name: TUserName;
    gender: 'Male' | 'Female';
    dateOfBirth: Date;
    email: string;
    contactNumber: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress: string;
    permanentAddress: string;
    profileImg?: string;
    isDeleted: boolean;
}
