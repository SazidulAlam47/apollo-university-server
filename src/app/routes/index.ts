import { Router } from 'express';
import { AcademicSemesterRoutes } from './../modules/academicSemester/academicSemester.route';
import { UserRoutes } from '../modules/user/user.route';
import { StudentRoutes } from '../modules/student/student.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/students',
        route: StudentRoutes,
    },
    {
        path: '/academic-semester',
        route: AcademicSemesterRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
