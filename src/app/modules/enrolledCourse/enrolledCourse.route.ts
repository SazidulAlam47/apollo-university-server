import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/student-enrolled-courses',
    auth('student'),
    EnrolledCourseControllers.getMyEnrolledCourse,
);

router.get(
    '/faculty-enrolled-courses',
    auth('faculty'),
    EnrolledCourseControllers.getFacultyCourse,
);

router.post(
    '/',
    auth('student'),
    validateRequest(
        EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
    ),
    EnrolledCourseControllers.createEnrolledCourse,
);

router.patch(
    '/update-marks',
    auth('faculty'),
    validateRequest(
        EnrolledCourseValidations.updateEnrolledCourseMarksValidationSchema,
    ),
    EnrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoutes = router;
