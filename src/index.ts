require('reflect-metadata');

import express, { Request, Response } from 'express';
import morgan from 'morgan';
import userRouter from './http/routes/users';
import myDataSource from './data-source';

(async () => {
  try {
    await myDataSource.initialize();
    console.log('Data Source has been initialized!');

    const app = express();
    const port = 3000;

    app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'Hellooooo, Woaaaaarld!' });
    });
    app.use(express.json());
    app.use(morgan('dev'));
    app.use('/users', userRouter);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
})();
