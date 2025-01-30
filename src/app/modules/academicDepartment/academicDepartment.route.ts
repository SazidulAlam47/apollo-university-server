import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { academicDepartmentValidations } from './academicDepartment.validation';

const router = express.Router();

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);
router.get('/:id', AcademicDepartmentControllers.getAcademicDepartmentById);

router.post(
    '/',
    validateRequest(
        academicDepartmentValidations.createAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.createAcademicDepartment,
);

router.patch(
    '/:id',
    validateRequest(
        academicDepartmentValidations.updateAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.updateAcademicDepartmentById,
);

export const AcademicDepartmentRouters = router;
