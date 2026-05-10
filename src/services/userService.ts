import bcrypt from 'bcryptjs';
import { User, UserRole } from '../entity/User';
import { userRepository } from '../repositories/userRepository';

export type CreateUserData = Omit<User, 'id' | 'role'> & {
  role?: UserRole;
};

const userService = {
  getUsers: async (): Promise<User[]> => {
    const users = await userRepository.find();
    return users;
  },
  getUserById: async (id: string): Promise<User | null> => {
    const user = await userRepository.findOneBy({ id });
    return user || null;
  },
  getUserByEmail: async (email: string): Promise<User | null> => {
    const user = await userRepository.findByEmail(email);
    return user || null;
  },
  createUser: async (userData: CreateUserData): Promise<User> => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await userRepository.save({
      ...userData,
      password: hashedPassword,
      role: userData.role ?? 'user',
    });
    return newUser;
  },
};

export default userService;
