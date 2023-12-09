import { userService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  // const zodParseData = studentSchemaWithValidation.parse(studentData);
  const result = await userService.createStudentIntoDb(password, studentData);

  sendResponse(res, {
    message: 'Student created successfully',
    data: result,
  });
});

export const userControllers = {
  createStudent,
};
