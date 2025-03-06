import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from '../student/student.validation';
import { AdminValidations } from '../admin/admin.validation';
import { FacultyValidations } from '../faculty/faculty.validation';
import auth from '../../middlewares/auth';
import { UserValidations } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';
import FromDataToJson from '../../middlewares/FromDataToJson';

const router = express.Router();

router.post(
    '/create-student',
    auth('admin', 'superAdmin'),
    upload.single('file'),
    FromDataToJson,
    validateRequest(StudentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
);

router.post(
    '/create-faculty',
    auth('admin', 'superAdmin'),
    upload.single('file'),
    FromDataToJson,
    validateRequest(FacultyValidations.createFacultyValidationSchema),
    UserControllers.createFaculty,
);

router.post(
    '/create-admin',
    auth('superAdmin'),
    upload.single('file'),
    FromDataToJson,
    validateRequest(AdminValidations.createAdminValidationSchema),
    UserControllers.createAdmin,
);

router.get('/me', auth(), UserControllers.getMe);

router.post(
    '/change-status/:id',
    auth('admin'),
    validateRequest(UserValidations.changeStatusValidationSchema),
    UserControllers.changeStatus,
);

export const UserRoutes = router;
