# Cypress E2E Test Configuration

## Setup

1. Install Cypress:
```bash
npm install --save-dev cypress
```

2. Open Cypress for the first time:
```bash
npx cypress open
```

3. Configure `cypress.config.js`:

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:5000/api',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
  },
  env: {
    // TODO: Add your test credentials here
    adminEmail: 'your-admin@example.com',
    adminPassword: 'your-admin-password',
    testUserEmail: 'your-testuser@example.com',
    testUserPassword: 'your-test-password',
  },
  video: true,
  screenshotOnRunFailure: true,
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  responseTimeout: 15000,
});
```

## Test Structure

```
tests/e2e/
├── cypress/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.cy.js
│   │   │   ├── register.cy.js
│   │   │   └── password-reset.cy.js
│   │   ├── events/
│   │   │   ├── browse-events.cy.js
│   │   │   ├── register-event.cy.js
│   │   │   └── event-details.cy.js
│   │   ├── admin/
│   │   │   ├── dashboard.cy.js
│   │   │   ├── user-management.cy.js
│   │   │   ├── event-management.cy.js
│   │   │   └── check-in.cy.js
│   │   └── user/
│   │       ├── profile.cy.js
│   │       └── registrations.cy.js
│   ├── fixtures/
│   │   ├── users.json
│   │   ├── events.json
│   │   └── registrations.json
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── cypress.config.js
└── package.json
```

## Sample Test: Login

```javascript
// cypress/e2e/auth/login.cy.js
describe('User Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[name="email"]').type(Cypress.env('testUserEmail'));
    cy.get('input[name="password"]').type(Cypress.env('testUserPassword'));
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should navigate to register page', () => {
    cy.contains('Register').click();
    cy.url().should('include', '/register');
  });
});
```

## Sample Test: Event Registration

```javascript
// cypress/e2e/events/register-event.cy.js
describe('Event Registration', () => {
  before(() => {
    // Login before tests
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('testUserEmail'));
    cy.get('input[name="password"]').type(Cypress.env('testUserPassword'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should display available events', () => {
    cy.visit('/events');
    cy.get('.event-card').should('have.length.gt', 0);
  });

  it('should register for an event', () => {
    cy.visit('/events');
    cy.get('.event-card').first().click();
    cy.get('button').contains('Register').click();

    cy.contains('Registration successful').should('be.visible');
  });

  it('should prevent duplicate registration', () => {
    cy.visit('/events');
    cy.get('.event-card').first().click();
    cy.get('button').contains('Register').click();

    cy.contains('Already registered').should('be.visible');
  });
});
```

## Custom Commands

```javascript
// cypress/support/commands.js

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.config('apiUrl')}/auth/login`,
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});

// Admin login
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(Cypress.env('adminEmail'), Cypress.env('adminPassword'));
});

// Create event
Cypress.Commands.add('createEvent', (eventData) => {
  const token = window.localStorage.getItem('token');
  cy.request({
    method: 'POST',
    url: `${Cypress.config('apiUrl')}/events`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: eventData,
  });
});
```

## Running Tests

```bash
# Open Cypress Test Runner (GUI)
npm run cypress:open

# Run tests headlessly (CI/CD)
npm run cypress:run

# Run specific test file
npx cypress run --spec "cypress/e2e/auth/login.cy.js"

# Run tests in specific browser
npx cypress run --browser chrome
```

## package.json scripts

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test:e2e": "start-server-and-test 'npm run dev' http://localhost:3000 'cypress run'",
    "test:e2e:ci": "cypress run --browser chrome --headless"
  },
  "devDependencies": {
    "cypress": "^13.6.0",
    "start-server-and-test": "^2.0.3"
  }
}
```

## Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Avoid hardcoded waits** - use Cypress built-in waiting
3. **Clean up test data** after each test
4. **Use fixtures** for test data
5. **Create reusable custom commands**
6. **Test critical user flows** first
7. **Run tests in CI/CD** pipeline

## CI/CD Integration

Add to `.github/workflows/ci-pipeline.yml`:

```yaml
e2e-tests:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: cypress-io/github-action@v6
      with:
        start: npm run dev
        wait-on: 'http://localhost:3000'
        browser: chrome
        record: false
```

---

**Note**: Ensure backend and frontend are running before executing E2E tests.
