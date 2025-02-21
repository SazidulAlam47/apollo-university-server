import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', AcademicSemesterControllers.getAllAcademicSemester);
router.get('/:id', AcademicSemesterControllers.getAcademicSemesterById);

router.post(
    '/',
    auth('admin'),
    validateRequest(
        AcademicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.createAcademicSemester,
);

router.patch(
    '/:id',
    auth('admin'),
    validateRequest(
        AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateAcademicSemesterById,
);

export const AcademicSemesterRoutes = router;
