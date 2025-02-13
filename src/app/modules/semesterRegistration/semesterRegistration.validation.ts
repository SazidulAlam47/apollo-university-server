import { z } from 'zod';

const createSemesterRegistrationValidationSchema = z.object({
    body: z.object({
        academicSemester: z.string(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
    }),
});

const updateSemesterRegistrationValidationSchema = z.object({
    body: z.object({
        academicSemester: z.string().optional(),
        status: z
            .enum(['Ongoing', 'Ended'] as [string, ...string[]])
            .optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        minCredit: z.number().optional(),
        maxCredit: z.number().optional(),
    }),
});

export const SemesterRegistrationValidations = {
    createSemesterRegistrationValidationSchema,
    updateSemesterRegistrationValidationSchema,
};
