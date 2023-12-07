import express from 'express';
import { studentControllers } from './student.controler';

const router = express.Router();

router.post('/create-student', studentControllers.createStudent);
router.get('/', studentControllers.getAllStudent);
router.get('/:id', studentControllers.getSingleStudent);
router.delete('/:id', studentControllers.deleteStudent);

export const studentRoute = router;
