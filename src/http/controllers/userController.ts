import { Request, Response } from 'express';
import { User } from '../../entity/User';
import userService from '../../services/userService';

const userController = {
  index: async (req: Request, res: Response<User[]>) => {
    const users = await userService.getUsers();
    res.status(200).json(users);
  },
  show: async (
    req: Request<{ id: string }>,
    res: Response<User | { message: string }>,
  ) => {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await userService.getUserById(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  },
  showByEmail: async (
    req: Request<{ email: string }>,
    res: Response<User | { message: string }>,
  ) => {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);

    if (user) {
      return res.json(user);
    }

    return res.status(404).json({ message: 'User not found' });
  },
  store: async (
    req: Request,
    res: Response<{ message: string; user: User }>,
  ) => {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  },
};

export default userController;
