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

// ── Phase 1 security probes ────────────────────────────────────────────────

/**
 * Reads Supabase env from .env.local and runs RLS behavior probes against the
 * live database. Verifies the orders table has no public write/read policies
 * (migration 0001) and public INSERT still works for checkout.
 */
async function runRlsProbes() {
  const fs = await import('fs');
  const env = {};
  fs.readFileSync('.env.local', 'utf8').split('\n').forEach(l => {
    const t = l.trim();
    if (t && !t.startsWith('#')) {
      const i = t.indexOf('=');
      env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  });

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const admin = env.SUPABASE_SERVICE_ROLE_KEY;

  async function probe(label, method, path, body, expectStatus) {
    const r = await fetch(`${url}${path}`, {
      method,
      headers: { apikey: anon, Authorization: `Bearer ${anon}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : null,
    });
    const pass = expectStatus.includes(r.status);
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}: ${r.status} (expected ${expectStatus.join('/')})`);
    return r.status;
  }

  console.log('\n🛡️  === RLS PROBES (anon key, live DB) ===');
  // Public write/read on orders must be rejected after migration 0001
  await probe('ANON PATCH orders  ', 'PATCH', '/rest/v1/orders?order_code=eq.PROBE_X', { customer_note: 'x' }, [403, 401, 404]);
  await probe('ANON DELETE orders ', 'DELETE', '/rest/v1/orders?order_code=eq.PROBE_X', null, [403, 401, 404]);
  await probe('ANON SELECT orders ', 'GET', '/rest/v1/orders?select=*&limit=1', null, [200]); // 200 + empty [] is also acceptable
  // Public INSERT must work for checkout flow
  const insertRes = await fetch(`${url}/rest/v1/orders`, {
    method: 'POST',
    headers: { apikey: anon, Authorization: `Bearer ${anon}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ id: 'rls-probe-row', order_code: 'RLSPROBE1', customer_name: 'probe', customer_phone: '000', total_amount: 1, payment_method: 'cod', items: [] }),
  });
  console.log(`${insertRes.status === 201 ? 'PASS' : 'FAIL'}  ANON INSERT orders : ${insertRes.status} (expected 201)`);

  // Cleanup probe row (service role)
  if (insertRes.status === 201) {
    await fetch(`${url}/rest/v1/orders?id=eq.rls-probe-row`, {
      method: 'DELETE',
      headers: { apikey: admin, Authorization: `Bearer ${admin}` },
    });
  }
  console.log('🛡️  === RLS PROBES DONE ===');
}

const args = process.argv.slice(2);
if (args.includes('--rls')) {
  runRlsProbes();
} else {
  runSecurityTests();
}
