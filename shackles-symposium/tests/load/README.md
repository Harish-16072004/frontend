# Load Testing with k6

## Overview

Load testing ensures the application can handle expected traffic and identifies performance bottlenecks.

## Setup

1. Install k6:

**Windows (Chocolatey):**
```powershell
choco install k6
```

**Mac:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Docker:**
```bash
docker pull grafana/k6
```

## Test Structure

```
tests/load/
├── scenarios/
│   ├── smoke-test.js         # Minimal load (5 VUs, 1 min)
│   ├── load-test.js          # Average load (50 VUs, 5 mins)
│   ├── stress-test.js        # Above average (100 VUs, 10 mins)
│   ├── spike-test.js         # Sudden spike (0-200 VUs)
│   └── soak-test.js          # Extended duration (50 VUs, 1 hour)
├── utils/
│   ├── config.js             # Shared configuration
│   └── helpers.js            # Helper functions
└── README.md
```

## Sample Test: API Load Test

```javascript
// scenarios/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],     // Error rate should be less than 1%
    errors: ['rate<0.1'],               // Custom error rate
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000/api';

export default function () {
  // Test 1: Get all events
  let eventsRes = http.get(`${BASE_URL}/events`);
  check(eventsRes, {
    'get events status 200': (r) => r.status === 200,
    'get events has data': (r) => r.json('events') !== undefined,
  }) || errorRate.add(1);
  
  sleep(1);

  // Test 2: Get specific event
  if (eventsRes.json('events') && eventsRes.json('events').length > 0) {
    const eventId = eventsRes.json('events')[0]._id;
    let eventRes = http.get(`${BASE_URL}/events/${eventId}`);
    check(eventRes, {
      'get event status 200': (r) => r.status === 200,
      'event has name': (r) => r.json('event.name') !== undefined,
    }) || errorRate.add(1);
  }

  sleep(1);

  // Test 3: Login
  const loginPayload = JSON.stringify({
    email: 'test@example.com',
    password: 'Test@123',
  });

  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, loginParams);
  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login has token': (r) => r.json('token') !== undefined,
  }) || errorRate.add(1);

  sleep(2);
}
```

## Smoke Test

```javascript
// scenarios/smoke-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000/api';

export default function () {
  // Minimal smoke test
  const res = http.get(`${BASE_URL}/events`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

## Stress Test

```javascript
// scenarios/stress-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp up
    { duration: '5m', target: 100 },   // Stay at 100
    { duration: '2m', target: 200 },   // Stress to 200
    { duration: '5m', target: 200 },   // Stay at 200
    { duration: '5m', target: 300 },   // Beyond limits
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000/api';

export default function () {
  const res = http.get(`${BASE_URL}/events`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

## Spike Test

```javascript
// scenarios/spike-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },    // Normal load
    { duration: '30s', target: 200 },   // Sudden spike
    { duration: '1m', target: 200 },    // Stay at spike
    { duration: '10s', target: 10 },    // Quick recovery
    { duration: '1m', target: 10 },     // Normal again
  ],
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000/api';

export default function () {
  const res = http.get(`${BASE_URL}/events`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

## Soak Test (Endurance)

```javascript
// scenarios/soak-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 50 },    // Ramp up
    { duration: '1h', target: 50 },    // Stay for 1 hour
    { duration: '5m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000/api';

export default function () {
  const res = http.get(`${BASE_URL}/events`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
```

## Running Tests

```bash
# Run smoke test
k6 run scenarios/smoke-test.js

# Run load test
k6 run scenarios/load-test.js

# Run stress test
k6 run scenarios/stress-test.js

# Run spike test
k6 run scenarios/spike-test.js

# Run soak test
k6 run scenarios/soak-test.js

# Run with custom environment variable
k6 run --env BASE_URL=https://api.shackles-symposium.com/api scenarios/load-test.js

# Run with output to file
k6 run --out json=results.json scenarios/load-test.js

# Run with Docker
docker run -v $(pwd):/scripts grafana/k6 run /scripts/scenarios/load-test.js
```

## Metrics Explanation

### Default Metrics
- **http_req_duration**: Total request time
- **http_req_waiting**: Time waiting for response
- **http_req_connecting**: TCP connection time
- **http_req_sending**: Time sending data
- **http_req_receiving**: Time receiving data
- **http_req_failed**: Rate of failed requests
- **http_reqs**: Total requests
- **iterations**: Number of VU iterations
- **vus**: Number of active virtual users

### Custom Thresholds
```javascript
thresholds: {
  'http_req_duration': ['p(95)<500'],      // 95th percentile < 500ms
  'http_req_duration': ['p(99)<1000'],     // 99th percentile < 1s
  'http_req_failed': ['rate<0.01'],        // < 1% errors
  'http_reqs': ['rate>100'],               // > 100 req/s
}
```

## Best Practices

1. **Start with smoke tests** before larger load tests
2. **Test in staging** environment first
3. **Monitor backend metrics** during tests
4. **Gradually increase load** to find breaking points
5. **Test realistic scenarios** based on expected user behavior
6. **Run soak tests overnight** to find memory leaks
7. **Document baseline performance** for comparisons

## CI/CD Integration

Add to `.github/workflows/load-test.yml`:

```yaml
name: Load Testing

on:
  schedule:
    - cron: '0 2 * * 0'  # Run weekly
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run k6 load test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load/scenarios/load-test.js
```

## Results Analysis

After running tests, analyze:
- Response times (p95, p99)
- Error rates
- Throughput (requests/second)
- Resource utilization (CPU, memory)
- Database connection pool usage
- Cache hit/miss rates

---

**Target Performance Goals:**
- Response time: p95 < 500ms
- Error rate: < 1%
- Throughput: > 100 req/s
- Availability: > 99.9%
