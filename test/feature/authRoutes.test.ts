import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import request from 'supertest';

const adminToken = jwt.sign(
  { userId: 'admin-id', email: 'admin@example.com', role: 'admin' },
  process.env.JWT_SECRET || 'secret-change-me',
  { expiresIn: '1h' },
);

const { mockAuthService } = vi.hoisted(() => ({
  mockAuthService: { register: vi.fn(), login: vi.fn() },
}));

vi.mock('../../src/services/authService', () => ({
  default: mockAuthService,
}));

import app from '../../src/app';

describe('feature | /auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('returns 201 with token and user on valid payload', async () => {
      const authResult = {
        token: 'jwt-token',
        user: {
          id: '1',
          email: 'new@example.com',
          name: 'New User',
          role: 'user',
        },
      };
      mockAuthService.register.mockResolvedValue(authResult);

      const response = await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'new@example.com',
          name: 'New User',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(authResult);
      expect(mockAuthService.register).toHaveBeenCalledWith({
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      });
    });

    it('returns 400 when payload is invalid', async () => {
      const response = await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'not-an-email' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/login', () => {
    it('returns 200 with token and user on valid credentials', async () => {
      const authResult = {
        token: 'jwt-token',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'User',
          role: 'user',
        },
      };
      mockAuthService.login.mockResolvedValue(authResult);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(authResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        'user@example.com',
        'password123',
      );
    });

    it('returns 401 when credentials are invalid', async () => {
      mockAuthService.login.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'wrong' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('returns 400 when email is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('returns 400 when email is invalid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'not-an-email', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('returns 400 when password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'user@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });
});
