import { Router } from 'express';
import { studentRoute } from '../modules/student/student.route';
import { userRoute } from '../modules/user/user.route';
import { AcademicSemesterRoute } from '../modules/academicSemester/academicSemester.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/students',
    route: studentRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;