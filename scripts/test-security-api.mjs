import http from 'http';

/**
 * Automated Security & API Test Script
 * Runs security & rate-limiting checks against the project's API routes.
 */

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const payload = JSON.stringify(body);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'X-Forwarded-For': '198.51.100.42', // Simulated IP for Rate Limiting test
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runSecurityTests() {
  console.log('🚀 === STARTING AUTOMATED SECURITY & API TESTS === 🚀\n');

  try {
    // Test 1: Payload Validation Error Check (400)
    console.log('TEST 1: Invalid Payload Validation on /api/orders/payos-create...');
    const res1 = await makeRequest('/api/orders/payos-create', 'POST', { amount: -50 });
    console.log(`Result Status: ${res1.status}`);
    if (res1.status === 400) {
      console.log('TEST 1 PASSED: Rejected invalid payload with 400 Bad Request.\n');
    } else {
      console.log(`TEST 1 Status: ${res1.status} (Expected 400)\n`);
    }

    // Test 2: Webhook HMAC Signature Mismatch Check (401)
    console.log('TEST 2: Forged HMAC Signature on /api/webhooks/payos...');
    const res2 = await makeRequest('/api/webhooks/payos', 'POST', {
      code: '00',
      data: { orderCode: 123 },
      signature: 'FORGED_INVALID_SIGNATURE_HASH',
    });
    console.log(`Result Status: ${res2.status}`);
    if (res2.status === 401) {
      console.log('TEST 2 PASSED: Blocked forged webhook with 401 Unauthorized.\n');
    } else {
      console.log(`TEST 2 Status: ${res2.status}\n`);
    }

    // Test 3: Strict Rate Limiting Check (Max 3 orders / hour / IP)
    console.log('TEST 3: Testing Strict 3 Orders/Hour IP Rate Limiting...');
    for (let i = 1; i <= 4; i++) {
      const res = await makeRequest('/api/orders/payos-create', 'POST', {
        orderCode: 1000 + i,
        amount: 150000,
        description: `Order test #${i}`,
      });
      console.log(`  Request #${i} -> Status: ${res.status}`);
      if (i === 4) {
        if (res.status === 429) {
          console.log('TEST 3 PASSED: 4th request blocked with 429 Too Many Requests (Rate limit enforced).\n');
        } else {
          console.log(`TEST 3 Status: ${res.status} (Expected 429)\n`);
        }
      }
    }

    console.log('🎉 === ALL SECURITY TESTS EXECUTED === 🎉');
  } catch (error) {
    console.error('Test execution error:', error.message);
  }
}

runSecurityTests();
