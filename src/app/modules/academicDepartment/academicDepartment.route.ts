import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { academicDepartmentValidations } from './academicDepartment.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);
router.get('/:id', AcademicDepartmentControllers.getAcademicDepartmentById);

router.post(
    '/',
    auth('admin', 'superAdmin'),
    validateRequest(
        academicDepartmentValidations.createAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.createAcademicDepartment,
);

router.patch(
    '/:id',
    auth('admin', 'superAdmin'),
    validateRequest(
        academicDepartmentValidations.updateAcademicDepartmentValidationSchema,
    ),
    AcademicDepartmentControllers.updateAcademicDepartmentById,
);

export const AcademicDepartmentRouters = router;
