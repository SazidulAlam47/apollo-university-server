import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from '../student/student.validation';
import { AdminValidations } from '../admin/admin.validation';
import { FacultyValidations } from '../faculty/faculty.validation';
import auth from '../../middlewares/auth';
import { UserRole } from './user.constant';

const router = express.Router();

router.post(
    '/create-student',
    auth(UserRole.admin),
    validateRequest(StudentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
);

router.post(
    '/create-faculty',
    auth(UserRole.admin),
    validateRequest(FacultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
);

router.post(
    '/create-admin',
    // auth(UserRole.admin),
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
);

export const UserRoutes = router;
