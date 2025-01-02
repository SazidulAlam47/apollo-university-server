export interface UserName {
    firstName: string;
    middleName?: string;
    lastName: string;
}

export interface Guardian {
    fatherName: string;
    fatherOccupation: string;
    fatherContact: string;
    motherName: string;
    motherOccupation: string;
    motherContact: string;
}

export interface LocalGuardian {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
}

export interface Student {
    id: string;
    name: UserName;
    gender: "Male" | "Female";
    dateOfBirth: string;
    email: string;
    contactNumber: string;
    emergencyContact: string;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    presentAddress: string;
    permanentAddress: string;
    guardian: Guardian;
    localGuardian: LocalGuardian;
    profileImg?: string;
    isActive: "Active" | "Blocked";
}