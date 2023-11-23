import express, { Request, Response } from 'express';
import cors from 'cors';
import { studentRoute } from './app/modules/student/student.route';
const app = express();

// parser
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1/students', studentRoute);

app.get('/', (req: Request, res: Response) => {
  const a = 'Hello, world!';
  res.send(a);
});

export default app;
