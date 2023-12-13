/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const getAllStudent = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudentFromDb(req.query);

  sendResponse(res, {
    message: 'Student retrieved successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.getSingleStudentFromDb(studentId);

  sendResponse(res, {
    message: 'Student retrieved successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateStudentIntoDB(studentId, student);

  sendResponse(res, {
    message: 'Student is updated successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.deleteStudentFromDb(studentId);

  sendResponse(res, {
    message: 'Student delete successfully',
    data: result,
  });
});

export const studentControllers = {
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
