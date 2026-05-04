import { Router } from 'express';
import userController from '../controllers/userController';
import { validate } from '../middlewares/validators/validate';
import { createUserSchema } from '../middlewares/validators/schemas/createUserSchema';
import { getUserByEmailSchema } from '../middlewares/validators/schemas/getUserByEmailSchema';

const userRouter = Router();

userRouter.get('/', userController.index);

userRouter.get(
  '/email/:email',
  validate(getUserByEmailSchema),
  userController.showByEmail,
);

userRouter.get('/:id', userController.show);

userRouter.post('/', validate(createUserSchema), userController.store);

export default userRouter;
