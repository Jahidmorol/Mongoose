/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { studentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

const getAllStudent = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudentFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.getSingleStudentFromDb(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrieved successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateStudentIntoDB(studentId, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student is updated successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.deleteStudentFromDb(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
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
