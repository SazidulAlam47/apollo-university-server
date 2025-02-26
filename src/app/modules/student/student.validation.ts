import { z } from 'zod';
import {
    createUserNameValidationSchema,
    updateUserNameValidationSchema,
} from '../user/user.validation';

const createGuardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContact: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContact: z.string(),
});

const updateGuardianValidationSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherContact: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherContact: z.string().optional(),
});

const createLocalGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
});
const updateLocalGuardianValidationSchema = z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
});

const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(20).optional(),
        student: z.object({
            name: createUserNameValidationSchema,
            gender: z.enum(['Male', 'Female']),
            dateOfBirth: z.string(),
            email: z.string().email(),
            contactNumber: z.string(),
            emergencyContact: z.string(),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            guardian: createGuardianValidationSchema,
            localGuardian: createLocalGuardianValidationSchema,
            academicDepartment: z.string(),
            admissionSemester: z.string(),
        }),
    }),
});

const updateStudentValidationSchema = z.object({
    body: z.object({
        student: z.object({
            name: updateUserNameValidationSchema.optional(),
            gender: z.enum(['Male', 'Female']).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNumber: z.string().optional(),
            emergencyContact: z.string().optional(),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            guardian: updateGuardianValidationSchema.optional(),
            localGuardian: updateLocalGuardianValidationSchema.optional(),
            academicDepartment: z.string().optional(),
            admissionSemester: z.string().optional(),
        }),
    }),
});

export const StudentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
};
