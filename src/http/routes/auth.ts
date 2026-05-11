import { Router } from 'express';
import authController from '../controllers/authController';
import { validate } from '../middlewares/validators/validate';
import { createUserSchema, loginSchema } from '../middlewares/validators/schemas/createUserSchema';
import { authenticate, authorize } from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/register', authenticate, authorize(['admin']), validate(createUserSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);

export default authRouter;
