import mongoose from 'mongoose';
import { Student } from './student.model';
import appError from '../../errors/appError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllStudentFromDb = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getSingleStudentFromDb = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDb = async (id: string) => {
  // const result = await Student.updateOne({ id }, { isDeleted: true });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { upsert: true, session },
    );

    if (!deleteStudent) {
      throw new appError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { upsert: true, session },
    );

    if (!deletedUser) {
      throw new appError(httpStatus.BAD_REQUEST, 'Failed to delete User');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

export const studentServices = {
  getAllStudentFromDb,
  getSingleStudentFromDb,
  deleteStudentFromDb,
};
