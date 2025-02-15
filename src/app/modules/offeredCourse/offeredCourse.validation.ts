import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeValidationSchema = z.string().refine(
    (time) => {
        const regex = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:MM
        return regex.test(time);
    },
    {
        message: 'Invalid time format, expected "HH:MM" in 24 hours format',
    },
);

const createOfferedCourseValidationSchema = z.object({
    body: z
        .object({
            semesterRegistration: z.string(),
            academicFaculty: z.string(),
            academicDepartment: z.string(),
            course: z.string(),
            faculty: z.string(),
            maxCapacity: z.number(),
            section: z.number(),
            days: z.enum(Days as [string, ...string[]]).array(),
            startTime: timeValidationSchema,
            endTime: timeValidationSchema,
        })
        .refine(
            ({ startTime, endTime }) => {
                const start = new Date(`1970-01-01T${startTime}:00`);
                const end = new Date(`1970-01-01T${endTime}:00`);

                return end > start;
            },
            {
                message: 'Start time should be before end time',
            },
        ),
});

const updateOfferedCourseValidationSchema = z.object({
    body: z
        .object({
            faculty: z.string().optional(),
            maxCapacity: z.number().optional(),
            section: z.number().optional(),
            days: z
                .enum(Days as [string, ...string[]])
                .array()
                .optional(),
            startTime: timeValidationSchema.optional(),
            endTime: timeValidationSchema.optional(),
        })
        .refine(
            ({ startTime, endTime }) => {
                const start = new Date(`1970-01-01T${startTime}:00`);
                const end = new Date(`1970-01-01T${endTime}:00`);

                return end > start;
            },
            {
                message: 'Start time should be before end time',
            },
        ),
});

export const OfferedCourseValidations = {
    createOfferedCourseValidationSchema,
    updateOfferedCourseValidationSchema,
};
