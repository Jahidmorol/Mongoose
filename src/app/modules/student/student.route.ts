import express from 'express';
import { studentControllers } from './student.controler';

const router = express.Router();

router.post('/create-student', studentControllers.createStudent);
router.get('/', studentControllers.getAllStudent);
router.get('/:id', studentControllers.getSingleStudent);

export const studentRoute = router;
