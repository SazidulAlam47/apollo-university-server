import express from 'express';
import { FacultyControllers } from './faculty.controller';
import { FacultyValidations } from './faculty.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculty);
router.get('/:facultyId', FacultyControllers.getFacultyById);

router.patch(
    '/:facultyId',
    validateRequest(FacultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFacultyById,
);

router.delete('/:facultyId', FacultyControllers.deleteFacultyById);

export const FacultyRouters = router;
