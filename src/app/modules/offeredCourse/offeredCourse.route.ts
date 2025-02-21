import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', OfferedCourseControllers.getAllOfferedCourse);
router.get('/:id', OfferedCourseControllers.getOfferedCourseById);

router.post(
    '/',
    auth('admin'),
    validateRequest(
        OfferedCourseValidations.createOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.createOfferedCourse,
);

router.patch(
    '/:id',
    auth('admin'),
    validateRequest(
        OfferedCourseValidations.updateOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
    '/:id',
    auth('admin'),
    OfferedCourseControllers.deleteOfferedCourse,
);

export const OfferedCourseRoutes = router;
