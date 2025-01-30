import express from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidations } from './academicFaculty.validation';

const router = express.Router();

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);
router.get('/:id', AcademicFacultyControllers.getAcademicFacultyById);

router.post(
    '/',
    validateRequest(
        academicFacultyValidations.createAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.createAcademicFaculty,
);

router.patch(
    '/:id',
    validateRequest(
        academicFacultyValidations.updateAcademicFacultyValidationSchema,
    ),
    AcademicFacultyControllers.updateAcademicFacultyById,
);

export const AcademicFacultyRouters = router;
