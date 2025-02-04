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
