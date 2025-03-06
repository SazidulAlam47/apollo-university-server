import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth('faculty', 'admin'), StudentControllers.getAllStudents);
router.get('/:id', auth('faculty', 'admin'), StudentControllers.getStudentById);

router.delete(
    '/:id',
    auth('admin', 'superAdmin'),
    StudentControllers.deleteStudent,
);

router.patch(
    '/:id',
    auth('admin', 'superAdmin'),
    validateRequest(StudentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
);

export const StudentRoutes = router;
