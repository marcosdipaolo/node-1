import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret-change-me';

const userToken = jwt.sign(
  { userId: 'user-1', email: 'user@example.com', role: 'user' },
  JWT_SECRET
);
const adminToken = jwt.sign(
  { userId: 'admin-1', email: 'admin@example.com', role: 'admin' },
  JWT_SECRET
);

const { mockService } = vi.hoisted(() => ({
  mockService: {
    getUsers: vi.fn(),
    getUserById: vi.fn(),
    getUserByEmail: vi.fn(),
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

    const response = await request(app).get('/users').set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
    expect(mockService.getUsers).toHaveBeenCalled();
  });

  it('returns 401 when listing users without a token', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(401);
    expect(mockService.getUsers).not.toHaveBeenCalled();
  });

  it('returns 403 when listing users as a non-admin', async () => {
    const response = await request(app).get('/users').set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(403);
    expect(mockService.getUsers).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid email on /users/email/:email', async () => {
    const response = await request(app)
      .get('/users/email/not-an-email')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(mockService.getUserByEmail).not.toHaveBeenCalled();
  });

  it('returns user when /users/email/:email is valid', async () => {
    const user = { id: '1', email: 'first@example.com', name: 'First' };
    mockService.getUserByEmail.mockResolvedValue(user);

    const response = await request(app)
      .get('/users/email/first@example.com')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
    expect(mockService.getUserByEmail).toHaveBeenCalledWith('first@example.com');
  });
});
