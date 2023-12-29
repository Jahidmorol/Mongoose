import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res) => {
  console.log('reqTest', req.user);

  const result = await FacultyServices.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    message: 'Faculties are retrieved successfully',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const result = await FacultyServices.getSingleFacultyFromDB(
    req.params.facultyId,
  );

  sendResponse(res, {
    message: 'Faculties is retrieved successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(facultyId, faculty);

  sendResponse(res, {
    message: 'Faculty is updated successfully',
    data: result,
  });
});
const deleteFaculty = catchAsync(async (req, res) => {
  await FacultyServices.deleteFacultyFromDB(req.params.facultyId);

  sendResponse(res, {
    message: 'Faculty is deleted successfully',
    data: null,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
