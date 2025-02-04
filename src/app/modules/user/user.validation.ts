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
