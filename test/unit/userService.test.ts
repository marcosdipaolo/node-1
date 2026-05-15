import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from '../../src/entity/User';

const { mockRepository } = vi.hoisted(() => ({
  mockRepository: {
    find: vi.fn(),
    findOneBy: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
  },
}));

vi.mock('../../src/repositories/userRepository', () => ({
  userRepository: mockRepository,
}));

import userService from '../../src/services/userService';

describe('unit | userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all users', async () => {
    const users: User[] = [
      {
        id: '1',
        email: 'first@example.com',
        name: 'First',
        password: 'password',
        role: 'user',
      },
      {
        id: '2',
        email: 'second@example.com',
        name: 'Second',
        password: 'password',
        role: 'user',
      },
    ];

    mockRepository.find.mockResolvedValue(users);

    const result = await userService.getUsers();

    expect(result).toEqual(users);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('returns a user by id', async () => {
    const user: User = {
      id: '1',
      email: 'first@example.com',
      name: 'First',
      password: 'password',
      role: 'user',
    };
    mockRepository.findOneBy.mockResolvedValue(user);

    const result = await userService.getUserById('1');

    expect(result).toEqual(user);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
  });

  it('returns null when user by id is not found', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    const result = await userService.getUserById('missing-id');

    expect(result).toBeNull();
  });

  it('returns a user by email', async () => {
    const user: User = {
      id: '1',
      email: 'first@example.com',
      name: 'First',
      password: 'password',
      role: 'user',
    };
    mockRepository.findByEmail.mockResolvedValue(user);

    const result = await userService.getUserByEmail('first@example.com');

    expect(result).toEqual(user);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('first@example.com');
  });

  it('creates a user', async () => {
    const userData = {
      email: 'new@example.com',
      name: 'New User',
      password: 'password123',
    };
    const savedUser: User = {
      id: '123',
      ...userData,
      role: 'user',
    };
    mockRepository.save.mockResolvedValue(savedUser);

    const result = await userService.createUser(userData);

    expect(result).toEqual(savedUser);
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'new@example.com',
        name: 'New User',
        role: 'user',
        password: expect.any(String),
      })
    );
  });
});
