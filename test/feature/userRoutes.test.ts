import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

const { mockService } = vi.hoisted(() => ({
  mockService: {
    getUsers: vi.fn(),
    getUserById: vi.fn(),
    getUserByEmail: vi.fn(),
    createUser: vi.fn(),
  },
}));

vi.mock('../../src/services/userService', () => ({
  default: mockService,
}));

import app from '../../src/app';

describe('feature | /users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the list of users', async () => {
    const users = [
      { id: '1', email: 'first@example.com', name: 'First' },
      { id: '2', email: 'second@example.com', name: 'Second' },
    ];
    mockService.getUsers.mockResolvedValue(users);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
    expect(mockService.getUsers).toHaveBeenCalled();
  });

  it('returns 400 for invalid email on /users/email/:email', async () => {
    const response = await request(app).get('/users/email/not-an-email');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(mockService.getUserByEmail).not.toHaveBeenCalled();
  });

  it('returns user when /users/email/:email is valid', async () => {
    const user = { id: '1', email: 'first@example.com', name: 'First' };
    mockService.getUserByEmail.mockResolvedValue(user);

    const response = await request(app).get('/users/email/first@example.com');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
    expect(mockService.getUserByEmail).toHaveBeenCalledWith(
      'first@example.com',
    );
  });

  it('returns 201 when creating a valid user', async () => {
    const userPayload = {
      name: 'Test User',
      email: 'test@example.com',
    };
    const createdUser = { id: '123', ...userPayload };
    mockService.createUser.mockResolvedValue(createdUser);

    const response = await request(app).post('/users').send(userPayload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'User created successfully',
      user: createdUser,
    });
    expect(mockService.createUser).toHaveBeenCalledWith(userPayload);
  });

  it('returns 400 when creating a user with invalid payload', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(mockService.createUser).not.toHaveBeenCalled();
  });
});
