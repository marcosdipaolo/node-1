import { Request, Response } from 'express';
import authService from '../../services/authService';

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(result);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json(result);
  },
};

export default authController;
