import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from '../student/student.validation';
import { AdminValidations } from '../admin/admin.validation';
import { FacultyValidations } from '../faculty/faculty.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-student',
    auth('admin'),
    validateRequest(StudentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
);

router.post(
    '/create-faculty',
    auth('admin'),
    validateRequest(FacultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
);

router.post(
    '/create-admin',
    // auth('admin'),
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
);

router.get('/me', auth(), UserControllers.getMe);

export const UserRoutes = router;
