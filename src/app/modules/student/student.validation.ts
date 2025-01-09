import { z } from 'zod';

const userNameValidationSchema = z.object({
    firstName: z
        .string()
        .max(20, { message: 'First name should be less than 20 characters' })
        .refine(
            (value) => {
                const firstNameStr =
                    value.charAt(0).toUpperCase() +
                    value.slice(1).toLowerCase();
                return value === firstNameStr;
            },
            { message: 'First name is not in Capitalize format' },
        ),
    middleName: z.string().optional(),
    lastName: z
        .string()
        .max(20, { message: 'Last name should be less than 20 characters' }),
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
    name: userNameValidationSchema,
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
    guardian: guardianValidationSchema,
    localGuardian: localGuardianValidationSchema,
    profileImg: z.string().optional(),
    isActive: z.enum(['Active', 'Blocked']).default('Active'),
});

export default StudentValidationSchema;
