import express from 'express';
import { studentControllers } from './student.controler';

const router = express.Router();

router.get('/', studentControllers.getAllStudent);
router.get('/:id', studentControllers.getSingleStudent);
router.delete('/:id', studentControllers.deleteStudent);

export const studentRoute = router;
