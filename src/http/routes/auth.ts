import { Router } from 'express';
import authController from '../controllers/authController';
import { validate } from '../middlewares/validators/validate';
import { loginSchema } from '../middlewares/validators/schemas/createUserSchema';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), authController.login);

export default authRouter;
