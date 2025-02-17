import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controller';

const router = express.Router();

router.get('/', OfferedCourseControllers.getAllOfferedCourse);
router.get('/:id', OfferedCourseControllers.getOfferedCourseById);

router.post(
    '/',
    validateRequest(
        OfferedCourseValidations.createOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.createOfferedCourse,
);

router.patch(
    '/:id',
    validateRequest(
        OfferedCourseValidations.updateOfferedCourseValidationSchema,
    ),
    OfferedCourseControllers.updateOfferedCourse,
);

export const OfferedCourseRoutes = router;
