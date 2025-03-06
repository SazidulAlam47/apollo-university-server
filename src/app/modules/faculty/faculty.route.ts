import express from 'express';
import { FacultyControllers } from './faculty.controller';
import { FacultyValidations } from './faculty.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

router.get(
    '/',
    auth(),
    auth(UserRole.admin, UserRole.faculty),
    FacultyControllers.getAllFaculty,
);
router.get('/:id', auth(), FacultyControllers.getFacultyById);

router.patch(
    '/:id',
    auth('admin', 'faculty'),
    validateRequest(FacultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFacultyById,
);

router.delete(
    '/:id',
    auth('admin', 'superAdmin'),
    FacultyControllers.deleteFacultyById,
);

export const FacultyRouters = router;
