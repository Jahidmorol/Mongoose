import { TStudent } from './student.interface';
import { Student } from './student.model';
// import { studentSchemaWithValidation } from './student.validation';

const createStudentIntoDb = async (studentData: TStudent) => {
  // const validateStudent = studentSchemaWithValidation.parse(studentData);
  // const result = await StudentModel.create(validateStudent); // buildIn static method

  if (await Student.isUserExists(studentData.id)) {
    throw new Error('User already exists!');
  }

  const result = await Student.create(studentData);
  return result;

  // const student = new Student(studentData);
  // const result = await student.save(); // instance method
  // return result;
};

const getAllStudentFromDb = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDb = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteStudentFromDb = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const studentServices = {
  createStudentIntoDb,
  getAllStudentFromDb,
  getSingleStudentFromDb,
  deleteStudentFromDb,
};
