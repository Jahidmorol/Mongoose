import mongoose from 'mongoose';
import { Student } from './student.model';
import appError from '../../errors/appError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constants';

const getAllStudentFromDb = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };

  // let searchTerm = ''; // SET DEFAULT VALUE
  //
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH  :
  // { email: { $regex : query.searchTerm , $options: i}}
  // { presentAddress: { $regex : query.searchTerm , $options: i}}
  // { 'name.firstName': { $regex : query.searchTerm , $options: i}}

  // WE ARE DYNAMICALLY DOING IT USING LOOP ['email', 'name.firstName', 'presentAddress']
  // const searchQuery = Student.find({
  //   $or: ['email', 'name.firstName', 'presentAddress'].map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // FILTERING fUNCTIONALITY:
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // SORTING FUNCTIONALITY:

  // let sort = '-createdAt'; // SET DEFAULT VALUE

  // IF sort  IS GIVEN SET IT
  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // PAGINATION FUNCTIONALITY:

  // let page = 1; // SET DEFAULT VALUE FOR PAGE
  // let limit = 1; // SET DEFAULT VALUE FOR LIMIT
  // let skip = 0; // SET DEFAULT VALUE FOR SKIP

  // IF limit IS GIVEN SET IT
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // IF page IS GIVEN SET IT
  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // FIELDS LIMITING FUNCTIONALITY:

  // HOW OUR FORMAT SHOULD BE FOR PARTIAL MATCH

  // fields: 'name,email'; // WE ARE ACCEPTING FROM REQUEST
  // fields: 'name email'; // HOW IT SHOULD BE

  // let fields = '-__v'; // SET DEFAULT VALUE

  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }

  // const result = await limitQuery.select(fields);

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };
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

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  // empty object
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
    guardian: {
      fatherOccupation:"Teacher"
    }
    guardian.fatherOccupation = Teacher
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentFromDb = async (id: string) => {
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
  updateStudentIntoDB,
  deleteStudentFromDb,
};
