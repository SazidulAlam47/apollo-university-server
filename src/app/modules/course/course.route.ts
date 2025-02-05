import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.get('/', CourseControllers.getAllCourses);
router.get('/:id', CourseControllers.getCourseById);

router.post(
    '/',
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
);

router.delete('/:id', CourseControllers.deleteCourse);

export const CourseRouters = router;
