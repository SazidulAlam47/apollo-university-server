import { Router } from 'express';
import { AcademicSemesterRoutes } from './../modules/academicSemester/academicSemester.route';
import { UserRoutes } from '../modules/user/user.route';
import { StudentRoutes } from '../modules/student/student.route';
import { AcademicFacultyRouters } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRouters } from '../modules/academicDepartment/academicDepartment.route';
import { AdminRouters } from '../modules/admin/admin.route';
import { FacultyRouters } from '../modules/faculty/faculty.route';

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
    {
        path: '/academic-faculty',
        route: AcademicFacultyRouters,
    },
    {
        path: '/academic-department',
        route: AcademicDepartmentRouters,
    },
    {
        path: '/admin',
        route: AdminRouters,
    },
    {
        path: '/faculty',
        route: FacultyRouters,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
