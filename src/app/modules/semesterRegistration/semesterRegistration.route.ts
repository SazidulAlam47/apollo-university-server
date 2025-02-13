import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = Router();

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);
router.get('/:id', SemesterRegistrationControllers.getSemesterRegistrationById);

router.post(
    '/',
    validateRequest(
        SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.createSemesterRegistration,
);

router.patch(
    '/:id',
    validateRequest(
        SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.updateSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
