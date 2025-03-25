import { z } from 'zod';

const newPasswordSchema = z
    .string({ required_error: 'Please enter your Password' })
    .min(6, { message: 'Password must be at least 6 characters long' })
    .refine((password) => /[a-zA-Z]/.test(password), {
        message: 'Password must contain at least one letter',
    })
    .refine((password) => /[a-z]/.test(password), {
        message: 'Password must contain at least one lowercase letter',
    })
    .refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain at least one uppercase letter',
    })
    .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one number',
    })
    .refine(
        (password) => /[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹]/.test(password),
        {
            message: 'Password must contain at least one special character',
        },
    );

const loginValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'ID is required' }),
        password: z.string({ required_error: 'Password is required' }),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old password is required' }),
        newPassword: newPasswordSchema,
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({ required_error: 'You are not authorized' }),
    }),
});

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'ID is required' }),
    }),
});

const resetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'ID is required' }),
        password: newPasswordSchema,
    }),
});

export const AuthValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
