import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userService, { CreateUserData } from './userService';
import { User, UserRole } from '../entity/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-change-me';
const JWT_EXPIRES_IN = '1h';

export type AuthTokenPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

export type AuthResult = {
  token: string;
  user: Pick<User, 'id' | 'email' | 'name' | 'role'>;
};

const authService = {
  register: async (userData: CreateUserData): Promise<AuthResult> => {
    const user = await userService.createUser(userData);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  login: async (
    email: string,
    password: string,
  ): Promise<AuthResult | null> => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return null;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
};

export default authService;
