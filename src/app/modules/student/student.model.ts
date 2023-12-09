import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: 'String',
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name should have at least 2 characters'],
    maxlength: [10, 'First name cannot exceed 10 characters'],
  },
  middleName: { type: 'String', trim: true },
  lastName: {
    type: 'String',
    required: [true, 'Last name is required'],
    trim: true,
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: 'String',
    required: [true, 'Father name is required'],
    trim: true,
  },
  fatherOccupation: {
    type: 'String',
    required: [true, 'Father occupation is required'],
  },
  fatherContactNo: {
    type: 'String',
    required: [true, 'Father contact number is required'],
  },
  motherName: {
    type: 'String',
    required: [true, 'Mother name is required'],
    trim: true,
  },
  motherOccupation: {
    type: 'String',
    required: [true, 'Mother occupation is required'],
  },
  motherContactNo: {
    type: 'String',
    required: [true, 'Mother contact number is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: 'String', required: [true, 'Local guardian name is required'] },
  occupation: {
    type: 'String',
    required: [true, 'Local guardian occupation is required'],
  },
  contactNo: {
    type: 'String',
    required: [true, 'Local guardian contact number is required'],
  },
  address: {
    type: 'String',
    required: [true, 'Local guardian address is required'],
  },
});

export const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: 'String',
      required: [true, 'Student ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'Student name must be provided'],
    },
    gender: {
      type: 'String',
      enum: {
        values: ['male', 'female', 'others'],
        message: 'Invalid gender value: {VALUE}',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: 'String' },
    email: {
      type: 'String',
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: 'String',
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: 'Invalid blood group: {VALUE}',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: guardianSchema,
    localGuardian: localGuardianSchema,
    profileImg: { type: 'String' },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
