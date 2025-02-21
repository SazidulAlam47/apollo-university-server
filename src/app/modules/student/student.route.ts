import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth(), StudentControllers.getAllStudents);
router.get('/:id', auth(), StudentControllers.getStudentById);

router.delete('/:id', auth('admin'), StudentControllers.deleteStudent);

router.patch(
    '/:id',
    auth('student', 'admin'),
    validateRequest(StudentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
);

export const StudentRoutes = router;
