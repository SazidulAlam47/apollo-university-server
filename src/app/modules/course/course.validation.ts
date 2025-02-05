import { z } from 'zod';

const createPreRequisiteCourseValidationSchema = z.object({
    course: z.string(),
    isDeleted: z.boolean().default(false),
});

const updatePreRequisiteCourseValidationSchema = z.object({
    course: z.string(),
    isDeleted: z.boolean().default(false),
});

const createCourseValidationSchema = z.object({
    body: z.object({
        title: z.string(),
        prefix: z.string(),
        code: z.number(),
        credits: z.number(),
        preRequisiteCourses: createPreRequisiteCourseValidationSchema
            .array()
            .optional(),
    }),
});

const updateCourseValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        prefix: z.string().optional(),
        code: z.number().optional(),
        credits: z.number().optional(),
        preRequisiteCourses: updatePreRequisiteCourseValidationSchema
            .array()
            .optional(),
    }),
});

export const CourseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
};
