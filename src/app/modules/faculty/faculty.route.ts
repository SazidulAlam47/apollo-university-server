import express from 'express';
import { FacultyControllers } from './faculty.controller';
import { FacultyValidations } from './faculty.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculty);
router.get('/:id', FacultyControllers.getFacultyById);

router.patch(
    '/:id',
    validateRequest(FacultyValidations.updateFacultyValidationSchema),
    FacultyControllers.updateFacultyById,
);

router.delete('/:id', FacultyControllers.deleteFacultyById);

export const FacultyRouters = router;
