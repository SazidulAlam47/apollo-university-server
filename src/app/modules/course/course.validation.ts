import { z } from 'zod';

const createPreRequisiteCourseValidationSchema = z.object({
    course: z.string(),
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

export const CourseValidations = {
    createCourseValidationSchema,
};
