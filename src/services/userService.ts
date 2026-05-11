import bcrypt from 'bcryptjs';
import { User, UserRole } from '../entity/User';
import { userRepository } from '../repositories/userRepository';

export type CreateUserData = Omit<User, 'id' | 'role'> & {
  role?: UserRole;
};

const userService = {
  getUsers: (): Promise<User[]> => {
    return userRepository.find();
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
    return await userRepository.save({
      ...userData,
      password: hashedPassword,
      role: userData.role ?? 'user',
    });
  },
};

export default userService;
