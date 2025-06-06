import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/',
    auth('superAdmin', 'admin'),
    OfferedCourseControllers.getAllOfferedCourse,
);

router.get(
    '/student-offered-courses',
    auth('student'),
    OfferedCourseControllers.getMyOfferedCourses,
);

router.get(
    '/faculty-offered-courses',
    auth('faculty'),
    OfferedCourseControllers.getFacultyCourses,
);

router.get('/:id', auth(), OfferedCourseControllers.getOfferedCourseById);

router.post(
    '/',
    auth('admin', 'superAdmin'),
    validateRequest(
        OfferedCourseValidations.createOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.createOfferedCourse,
);

router.patch(
    '/:id',
    auth('admin', 'superAdmin'),
    validateRequest(
        OfferedCourseValidations.updateOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
    '/:id',
    auth('admin', 'superAdmin'),
    OfferedCourseControllers.deleteOfferedCourse,
);

export const OfferedCourseRoutes = router;
