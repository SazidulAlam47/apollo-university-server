/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { UserRole } from './user.constant';

export interface TUserName {
    firstName: string;
    middleName?: string;
    lastName: string;
}

export interface TUser {
    id: string;
    password: string;
    needsPasswordChange: boolean;
    role: 'student' | 'faculty' | 'admin';
    status: 'in-progress' | 'blocked';
    isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
    isUserExistsByCustomId(id: string): Promise<TUser>;
    isPasswordMatched(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>;
}

export type TUserRole = keyof typeof UserRole;
