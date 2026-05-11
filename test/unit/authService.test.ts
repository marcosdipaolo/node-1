import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from '../../src/entity/User';

const { mockUserService, mockBcryptCompare, mockJwtSign } = vi.hoisted(() => ({
  mockUserService: { getUserByEmail: vi.fn(), createUser: vi.fn() },
  mockBcryptCompare: vi.fn(),
  mockJwtSign: vi.fn(),
}));

vi.mock('../../src/services/userService', () => ({
  default: mockUserService,
}));

vi.mock('bcryptjs', () => ({
  default: { compare: mockBcryptCompare, hash: vi.fn() },
}));

vi.mock('jsonwebtoken', () => ({
  default: { sign: mockJwtSign },
}));

import authService from '../../src/services/authService';

describe('unit | authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('creates a user and returns a token', async () => {
      const user: User = {
        id: '1',
        email: 'new@example.com',
        name: 'New User',
        password: 'hashed',
        role: 'user',
      };
      mockUserService.createUser.mockResolvedValue(user);
      mockJwtSign.mockReturnValue('signed-token');

      const result = await authService.register({
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      });

      expect(result).toEqual({
        token: 'signed-token',
        user: { id: '1', email: 'new@example.com', name: 'New User', role: 'user' },
      });
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
  it('returns null when user is not found', async () => {
    mockUserService.getUserByEmail.mockResolvedValue(null);

    const result = await authService.login('missing@example.com', 'pass');

    expect(result).toBeNull();
    expect(mockBcryptCompare).not.toHaveBeenCalled();
  });

  it('returns null when password does not match', async () => {
    const user: User = {
      id: '1',
      email: 'user@example.com',
      name: 'User',
      password: 'hashed',
      role: 'user',
    };
    mockUserService.getUserByEmail.mockResolvedValue(user);
    mockBcryptCompare.mockResolvedValue(false);

    const result = await authService.login('user@example.com', 'wrong');

    expect(result).toBeNull();
    expect(mockJwtSign).not.toHaveBeenCalled();
  });

  it('returns token and user data when credentials are valid', async () => {
    const user: User = {
      id: '1',
      email: 'user@example.com',
      name: 'User',
      password: 'hashed',
      role: 'user',
    };
    mockUserService.getUserByEmail.mockResolvedValue(user);
    mockBcryptCompare.mockResolvedValue(true);
    mockJwtSign.mockReturnValue('signed-token');

    const result = await authService.login('user@example.com', 'correct');

    expect(result).toEqual({
      token: 'signed-token',
      user: { id: '1', email: 'user@example.com', name: 'User', role: 'user' },
    });
    expect(mockJwtSign).toHaveBeenCalledWith(
      { userId: '1', email: 'user@example.com', role: 'user' },
      expect.any(String),
      expect.objectContaining({ expiresIn: expect.any(String) }),
    );
  });
  });
});
