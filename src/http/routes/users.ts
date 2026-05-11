import { Router } from 'express';
import userController from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validators/validate';
import { getUserByEmailSchema } from '../middlewares/validators/schemas/getUserByEmailSchema';

const userRouter = Router();

userRouter.get('/', authenticate, authorize(['admin']), userController.index);

userRouter.get(
  '/email/:email',
  authenticate,
  validate(getUserByEmailSchema),
  userController.showByEmail,
);

userRouter.get('/:id', authenticate, userController.show);

export default userRouter;
