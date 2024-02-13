import express from 'express';
import { studentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentControllers.getAllStudent,
);
router.get(
  '/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  studentControllers.getSingleStudent,
);
router.patch(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentControllers.updateStudent,
);
router.delete(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentControllers.deleteStudent,
);

export const studentRoute = router;
