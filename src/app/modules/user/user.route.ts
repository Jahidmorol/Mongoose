import express from 'express';
import { userControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../Faculty/faculty.validation';
import { AdminValidations } from '../Admin/admin.validation';
const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(AdminValidations.createAdminValidationSchema),
  userControllers.createAdmin,
);

export const userRoute = router;
