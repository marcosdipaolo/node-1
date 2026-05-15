import { Request, Response } from 'express';
import { User } from '../../entity/User';
import userService from '../../services/userService';

type PublicUser = Omit<User, 'password'>;

const sanitizeUser = (user: User): PublicUser => {
  const { password, ...rest } = user;
  void password;
  return rest;
};

const userController = {
  index: async (req: Request, res: Response<PublicUser[]>) => {
    const users = await userService.getUsers();
    res.status(200).json(users.map(sanitizeUser));
  },
  show: async (req: Request<{ id: string }>, res: Response<PublicUser | { message: string }>) => {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await userService.getUserById(userId);

    if (user) {
      res.json(sanitizeUser(user));
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  },
  showByEmail: async (
    req: Request<{ email: string }>,
    res: Response<PublicUser | { message: string }>
  ) => {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);

    if (user) {
      return res.json(sanitizeUser(user));
    }

    return res.status(404).json({ message: 'User not found' });
  },
};

export default userController;
