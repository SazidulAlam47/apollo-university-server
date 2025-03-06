import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);
router.get('/:id', SemesterRegistrationControllers.getSemesterRegistrationById);

router.post(
    '/',
    auth('admin', 'superAdmin'),
    validateRequest(
        SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.createSemesterRegistration,
);

router.patch(
    '/:id',
    auth('admin', 'superAdmin'),
    validateRequest(
        SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
    ),
    SemesterRegistrationControllers.updateSemesterRegistration,
);

router.delete(
    '/:id',
    auth('admin', 'superAdmin'),
    SemesterRegistrationControllers.deleteSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
