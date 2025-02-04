import { z } from 'zod';
import {
    createUserNameValidationSchema,
    updateUserNameValidationSchema,
} from '../user/user.validation';

const createAdminValidationSchema = z.object({
    body: z.object({
        password: z.string(),
        admin: z.object({
            user: z.string(),
            name: createUserNameValidationSchema,
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
        password: z.string().optional(),
        admin: z.object({
            user: z.string().optional(),
            name: updateUserNameValidationSchema.optional(),
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

export const adminValidations = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
};
