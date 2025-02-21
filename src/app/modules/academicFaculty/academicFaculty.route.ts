import express from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidations } from './academicFaculty.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);
router.get('/:id', AcademicFacultyControllers.getAcademicFacultyById);

router.post(
    '/',
    auth('admin'),
    validateRequest(
        academicFacultyValidations.createAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.createAcademicFaculty,
);

router.patch(
    '/:id',
    auth('admin'),
    validateRequest(
        academicFacultyValidations.updateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFacultyById,
);

export const AcademicFacultyRouters = router;
