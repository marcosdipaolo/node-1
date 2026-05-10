import express from 'express';
import morgan from 'morgan';
import userRouter from './http/routes/users';
import authRouter from './http/routes/auth';

const app = express();

app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/', (_req, res) => {
  res.json({ message: 'Hellooooo, Woaaaaarld!' });
});
app.use('/auth', authRouter);
app.use('/users', userRouter);

export default app;
