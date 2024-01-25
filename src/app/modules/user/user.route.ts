import express, { NextFunction, Request, Response } from 'express';
import { userControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../Faculty/faculty.validation';
import { AdminValidations } from '../Admin/admin.validation';
import auth from '../../middlewares/auth';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';
const router = express.Router();

router.post(
  '/create-student',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log('From route req.body--->', req.body);
    req.body = JSON.parse(req.body.data);
    // console.log('From route req.body.data--->', req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth('admin'),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(AdminValidations.createAdminValidationSchema),
  userControllers.createAdmin,
);

router.get('/me', auth('student', 'faculty', 'admin'), userControllers.getMe);

router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(UserValidation.changeStatusValidationSchema),
  userControllers.changeStatus,
);

export const userRoute = router;
