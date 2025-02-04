import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from '../student/student.validation';
import { adminValidations } from '../admin/admin.validation';

const router = express.Router();

router.post(
    '/create-student',
    validateRequest(StudentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
);

router.post(
    '/create-admin',
    validateRequest(adminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
);

export const UserRoutes = router;
