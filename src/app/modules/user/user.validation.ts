import { z } from 'zod';
import { UserStatus } from './user.constant';

export const createUserNameValidationSchema = z.object({
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
});

export const updateUserNameValidationSchema = z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional().optional(),
    lastName: z.string().optional(),
});

const changeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(UserStatus as [string, ...string[]]),
    }),
});

export const UserValidations = {
    changeStatusValidationSchema,
};
