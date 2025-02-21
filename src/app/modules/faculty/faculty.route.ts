import express from 'express';
import { FacultyControllers } from './faculty.controller';
import { FacultyValidations } from './faculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.admin, UserRole.faculty),
    FacultyControllers.getAllFaculty,
);
router.get('/:id', FacultyControllers.getFacultyById);

router.patch(
    '/:id',
    validateRequest(FacultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFacultyById,
);

router.delete('/:id', FacultyControllers.deleteFacultyById);

export const FacultyRouters = router;
