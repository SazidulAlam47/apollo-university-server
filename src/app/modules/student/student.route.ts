import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validation';

const router = express.Router();

router.get('/', StudentControllers.getAllStudents);
router.get('/:id', StudentControllers.getStudentById);

router.delete('/:id', StudentControllers.deleteStudent);

router.patch(
    '/:id',
    validateRequest(StudentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
);

export const StudentRoutes = router;
