import { z } from "zod";

const userNameValidationSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
});

const guardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContact: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContact: z.string(),
});

const localGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
});

const StudentValidationSchema = z.object({
    id: z.string(),
    password: z.string(),
    name: userNameValidationSchema,
    gender: z.enum(["Male", "Female"]),
    dateOfBirth: z.string(),
    email: z.string().email(),
    contactNumber: z.string(),
    emergencyContact: z.string(),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    presentAddress: z.string(),
    permanentAddress: z.string(),
    guardian: guardianValidationSchema,
    localGuardian: localGuardianValidationSchema,
    profileImg: z.string().optional(),
    isActive: z.enum(["Active", "Blocked"]).default("Active"),
});

export const LoginValidationSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export default StudentValidationSchema;
