import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', CourseControllers.getAllCourses);
router.get('/:id', CourseControllers.getCourseById);

router.post(
    '/',
    auth('admin', 'superAdmin'),
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
);

router.patch(
    '/:id',
    auth('admin', 'superAdmin'),
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
);

router.get(
    '/:courseId/get-faculties',
    auth(),
    CourseControllers.getFacultiesOfCourse,
);

router.put(
    '/:courseId/assign-faculties',
    auth('admin', 'superAdmin'),
    validateRequest(CourseValidations.courseFacultyValidationSchema),
    CourseControllers.assignFacultiesWithCourse,
);

router.delete(
    '/:courseId/remove-faculties',
    auth('admin', 'superAdmin'),
    validateRequest(CourseValidations.courseFacultyValidationSchema),
    CourseControllers.removeFacultiesFromCourse,
);

router.delete(
    '/:id',
    auth('admin', 'superAdmin'),
    CourseControllers.deleteCourse,
);

export const CourseRouters = router;
