import { EnrolledCourseRoutes } from './../modules/enrolledCourse/enrolledCourse.route';
import { Router } from 'express';
import { AcademicSemesterRoutes } from './../modules/academicSemester/academicSemester.route';
import { UserRoutes } from '../modules/user/user.route';
import { StudentRoutes } from '../modules/student/student.route';
import { AcademicFacultyRouters } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRouters } from '../modules/academicDepartment/academicDepartment.route';
import { AdminRouters } from '../modules/admin/admin.route';
import { FacultyRouters } from '../modules/faculty/faculty.route';
import { CourseRouters } from '../modules/course/course.route';
import { SemesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { OfferedCourseRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { AuthRoutes } from '../modules/auth/auth.route';

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
        path: '/admins',
        route: AdminRouters,
    },
    {
        path: '/faculties',
        route: FacultyRouters,
    },
    {
        path: '/courses',
        route: CourseRouters,
    },
    {
        path: '/semester-registration',
        route: SemesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: OfferedCourseRoutes,
    },
    {
        path: '/enrolled-courses',
        route: EnrolledCourseRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
