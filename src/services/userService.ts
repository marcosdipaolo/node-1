import { User } from '../entity/User';
import { userRepository } from '../repositories/userRepository';

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
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const newUser = await userRepository.save(userData);
    return newUser;
  },
};

export default userService;
