import { z } from 'zod';
import {
    createUserNameValidationSchema,
    updateUserNameValidationSchema,
} from '../user/user.validation';

const createAdminValidationSchema = z.object({
    body: z.object({
        password: z.string(),
        admin: z.object({
            name: createUserNameValidationSchema,
            designation: z.string(),
            gender: z.enum(['Male', 'Female']),
            dateOfBirth: z.string(),
            email: z.string().email(),
            contactNumber: z.string(),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            profileImg: z.string().optional(),
        }),
    }),
});

const updateAdminValidationSchema = z.object({
    body: z.object({
        admin: z.object({
            name: updateUserNameValidationSchema.optional(),
            designation: z.string().optional(),
            gender: z.enum(['Male', 'Female']).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNumber: z.string().optional(),
            bloodGroup: z
                .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
                .optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            profileImg: z.string().optional().optional(),
        }),
    }),
});

export const AdminValidations = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
};
