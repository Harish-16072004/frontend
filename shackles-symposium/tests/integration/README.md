# Integration Tests

## Overview

Integration tests verify that different parts of the backend API work together correctly.

## Setup

1. Install dependencies:
```bash
npm install --save-dev jest supertest mongodb-memory-server
```

2. Create `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
};
```

## Test Structure

```
tests/integration/
├── __tests__/
│   ├── auth.test.js
│   ├── events.test.js
│   ├── registrations.test.js
│   ├── users.test.js
│   └── admin.test.js
├── setup.js
├── teardown.js
├── helpers.js
└── package.json
```

## Sample Test: Authentication

```javascript
// __tests__/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../BACKEND/src/server');
const User = require('../../BACKEND/src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@123',
        phone: '9876543210',
        college: 'Test College',
        year: '3rd Year',
        branch: 'Computer Science',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@123',
        phone: '9876543210',
        college: 'Test College',
        year: '3rd Year',
        branch: 'Computer Science',
      };

      await User.create(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@123',
        phone: '9876543210',
        college: 'Test College',
        year: '3rd Year',
        branch: 'Computer Science',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test@123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@123',
        phone: '9876543210',
        college: 'Test College',
        year: '3rd Year',
        branch: 'Computer Science',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@123',
        phone: '9876543210',
        college: 'Test College',
        year: '3rd Year',
        branch: 'Computer Science',
      });

      const token = user.getSignedJwtToken();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(user.email);
    });

    it('should not get user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
```

## Sample Test: Events API

```javascript
// __tests__/events.test.js
const request = require('supertest');
const app = require('../../BACKEND/src/server');
const Event = require('../../BACKEND/src/models/Event');

describe('Events API', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // TODO: Create test users in beforeAll or use environment variables
    // Create admin and user, get tokens
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.TEST_ADMIN_EMAIL,
        password: process.env.TEST_ADMIN_PASSWORD,
      });
    adminToken = adminResponse.body.token;

    const userResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      });
    userToken = userResponse.body.token;
  });

  describe('GET /api/events', () => {
    it('should get all events', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.events)).toBe(true);
    });

    it('should filter events by category', async () => {
      const response = await request(app)
        .get('/api/events?category=Technical')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.events.forEach(event => {
        expect(event.category).toBe('Technical');
      });
    });
  });

  describe('POST /api/events', () => {
    it('should create event as admin', async () => {
      const eventData = {
        name: 'Test Event',
        description: 'Test Description',
        category: 'Technical',
        venue: 'Test Venue',
        eventDate: new Date('2024-12-31'),
        registrationDeadline: new Date('2024-12-25'),
        maxParticipants: 100,
        registrationFee: 200,
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.event.name).toBe(eventData.name);
    });

    it('should not create event as regular user', async () => {
      const eventData = {
        name: 'Test Event',
        description: 'Test Description',
        category: 'Technical',
        venue: 'Test Venue',
        eventDate: new Date('2024-12-31'),
        registrationDeadline: new Date('2024-12-25'),
        maxParticipants: 100,
        registrationFee: 200,
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send(eventData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
```

## Running Tests

```bash
# Run all integration tests
npm test

# Run specific test file
npm test -- __tests__/auth.test.js

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## package.json scripts

```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "mongodb-memory-server": "^9.1.3"
  }
}
```

## Best Practices

1. **Use in-memory database** (mongodb-memory-server) for tests
2. **Clean up after each test** to ensure isolation
3. **Test all HTTP methods** (GET, POST, PUT, DELETE)
4. **Test authentication and authorization**
5. **Test validation and error handling**
6. **Use descriptive test names**
7. **Group related tests** with describe blocks
8. **Mock external services** (email, S3, payment gateway)

---

**Note**: Tests should be run in an isolated environment separate from development/production databases.
