import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/',
    auth('admin', 'superAdmin'),
    AcademicSemesterControllers.getAllAcademicSemester,
);
router.get('/:id', AcademicSemesterControllers.getAcademicSemesterById);

router.post(
    '/',
    auth('admin', 'superAdmin'),
    validateRequest(
        AcademicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.createAcademicSemester,
);

router.patch(
    '/:id',
    auth('admin', 'superAdmin'),
    validateRequest(
        AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateAcademicSemesterById,
);

export const AcademicSemesterRoutes = router;
