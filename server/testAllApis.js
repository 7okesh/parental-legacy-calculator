import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for making HTTP requests
function httpRequest(options, postData = null, isMultipart = false, boundary = '') {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: rawData });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      if (Buffer.isBuffer(postData)) {
        req.write(postData);
      } else if (typeof postData === 'string') {
        req.write(postData);
      } else {
        req.write(JSON.stringify(postData));
      }
    }
    req.end();
  });
}

async function runApiTestSuite() {
  console.log('====================================================');
  console.log('STARTING FULL BACKEND API TEST SUITE');
  console.log('====================================================\n');

  // Dynamically import server
  process.env.PORT = '5055';
  process.env.NODE_ENV = 'test';
  await import('./server.js');

  // Wait 1.5s for server to bind
  await new Promise(r => setTimeout(r, 1500));

  const PORT = 5055;
  let testToken = null;
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    totalCount++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      process.exitCode = 1;
    }
  }

  // TEST 1: Health Check
  console.log('[1] Testing GET /api/health ...');
  try {
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/health',
      method: 'GET'
    });
    assert(res.status === 200, `Health status code is 200 (Got ${res.status})`);
    assert(res.data && res.data.status === 'online', 'Status is "online"');
  } catch (err) {
    assert(false, `Health check request failed: ${err.message}`);
  }

  // TEST 2: User Registration
  const testEmail = `candidate_${Date.now()}@example.com`;
  console.log(`\n[2] Testing POST /api/auth/register (${testEmail}) ...`);
  try {
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Lokesh Prajapati',
      email: testEmail,
      password: 'SecurePassword123!'
    });
    assert(res.status === 201, `Register status code is 201 (Got ${res.status})`);
    assert(res.data && res.data.success === true, 'Registration succeeded');
    assert(res.data && res.data.data && res.data.data.token, 'Registration returns JWT token');
    testToken = res.data?.data?.token;
  } catch (err) {
    assert(false, `Register request failed: ${err.message}`);
  }

  // TEST 3: User Login
  console.log('\n[3] Testing POST /api/auth/login ...');
  try {
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: testEmail,
      password: 'SecurePassword123!'
    });
    assert(res.status === 200, `Login status code is 200 (Got ${res.status})`);
    assert(res.data && res.data.success === true, 'Login response success is true');
    assert(res.data && res.data.data && res.data.data.user, 'Login returns user object');
    testToken = res.data?.data?.token;
  } catch (err) {
    assert(false, `Login request failed: ${err.message}`);
  }

  // TEST 4: Get Current User Profile (GET /api/auth/me)
  console.log('\n[4] Testing GET /api/auth/me with Bearer Token ...');
  try {
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    });
    assert(res.status === 200, `GET /api/auth/me status code is 200 (Got ${res.status})`);
    assert(res.data && res.data.success === true, 'Profile lookup succeeded');
    assert(res.data && res.data.data && res.data.data.user && res.data.data.user.email === testEmail, `Profile email matches registered email (${res.data?.data?.user?.email})`);
    assert(res.data?.data?.user?.id || res.data?.data?.user?._id, 'Profile returns valid user identifier');
  } catch (err) {
    assert(false, `GET /api/auth/me failed: ${err.message}`);
  }

  // TEST 5: Calculator - Odd Day (Mother Dominant)
  console.log('\n[5] Testing POST /api/calculator/calculate (01/06/2026 - Odd Day) ...');
  try {
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/calculator/calculate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { dob: '01/06/2026' });

    assert(res.status === 200, `Calculate status code is 200 (Got ${res.status})`);
    assert(res.data?.data?.dominantParent === 'Mother', `Dominant parent is Mother (Got ${res.data?.data?.dominantParent})`);
    assert(res.data?.data?.motherTotal === 51.837, `Mother total is 51.837 (Got ${res.data?.data?.motherTotal})`);
    assert(res.data?.data?.fatherTotal === 48.163, `Father total is 48.163 (Got ${res.data?.data?.fatherTotal})`);
    assert(res.data?.data?.differencePercentage === 3.67, `Difference is 3.67% (Got ${res.data?.data?.differencePercentage}%)`);
    assert(res.data?.data?.grandTotal === 100, `Grand total is 100.000 (Got ${res.data?.data?.grandTotal})`);
  } catch (err) {
    assert(false, `Calculation odd day failed: ${err.message}`);
  }

  // TEST 6: Calculator - Even Day (Father Dominant)
  console.log('\n[6] Testing POST /api/calculator/calculate (02/06/2026 - Even Day) ...');
  try {
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/calculator/calculate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { dob: '02/06/2026' });

    assert(res.status === 200, `Calculate status code is 200 (Got ${res.status})`);
    assert(res.data?.data?.dominantParent === 'Father', `Dominant parent is Father (Got ${res.data?.data?.dominantParent})`);
    assert(res.data?.data?.fatherTotal === 51.837, `Father total is 51.837 (Got ${res.data?.data?.fatherTotal})`);
    assert(res.data?.data?.motherTotal === 48.163, `Mother total is 48.163 (Got ${res.data?.data?.motherTotal})`);
    assert(res.data?.data?.differencePercentage === 3.67, `Difference is 3.67% (Got ${res.data?.data?.differencePercentage}%)`);
    assert(res.data?.data?.grandTotal === 100, `Grand total is 100.000 (Got ${res.data?.data?.grandTotal})`);
  } catch (err) {
    assert(false, `Calculation even day failed: ${err.message}`);
  }

  // TEST 7: Calculator - Custom Factors
  console.log('\n[7] Testing POST /api/calculator/calculate with Custom Factors ...');
  try {
    const customFactors = [
      { id: 1, name: 'Custom Factor A', highBaseline: 25.000, lowBaseline: 20.000, totalBaseline: 45.000 },
      { id: 2, name: 'Custom Factor B', highBaseline: 30.000, lowBaseline: 25.000, totalBaseline: 55.000 }
    ];
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/calculator/calculate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { dob: '01/06/2026', customFactors });

    assert(res.status === 200, `Calculate custom factors status code is 200 (Got ${res.status})`);
    assert(res.data?.data?.factors?.length === 2, `Calculated using 2 custom factors (Got ${res.data?.data?.factors?.length})`);
    assert(res.data?.data?.factors[0]?.name === 'Custom Factor A', 'Factor name matched custom input');
  } catch (err) {
    assert(false, `Calculate custom factors failed: ${err.message}`);
  }

  // TEST 8: Save Calculation
  console.log('\n[8] Testing POST /api/calculator/save ...');
  try {
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/calculator/save',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      }
    }, {
      dob: '01/06/2026',
      dominantParent: 'Mother',
      motherTotal: 51.837,
      fatherTotal: 48.163,
      grandTotal: 100.000,
      differencePercentage: 3.67,
      factors: [
        { id: 1, name: 'Genetic Inheritance', motherValue: 10.719, fatherValue: 10.233, totalValue: 20.952 }
      ]
    });

    assert(res.status === 201, `Save status code is 201 (Got ${res.status})`);
    assert(res.data?.success === true, 'Save calculation succeeded');
  } catch (err) {
    assert(false, `Save calculation failed: ${err.message}`);
  }

  // TEST 9: Get Calculation History
  console.log('\n[9] Testing GET /api/calculator/history ...');
  try {
    const res = await httpRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/calculator/history',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    });

    assert(res.status === 200, `History status code is 200 (Got ${res.status})`);
    assert(res.data?.success === true, 'History lookup succeeded');
    assert(Array.isArray(res.data?.data), 'History returned an array of records');
    assert(res.data?.data?.length > 0, `History has at least 1 record (Got ${res.data?.data?.length})`);
  } catch (err) {
    assert(false, `Get history failed: ${err.message}`);
  }

  // TEST 10: Upload Excel (POST /api/upload/excel)
  console.log('\n[10] Testing POST /api/upload/excel with tteesstt.xlsx ...');
  try {
    const filePath = path.join(__dirname, '../tteesstt.xlsx');
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

      const header = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="Test.xlsx"\r\nContent-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`;
      const footer = `\r\n--${boundary}--\r\n`;

      const payload = Buffer.concat([
        Buffer.from(header, 'utf8'),
        fileBuffer,
        Buffer.from(footer, 'utf8')
      ]);

      const res = await httpRequest({
        hostname: '127.0.0.1',
        port: PORT,
        path: '/api/upload/excel',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': payload.length
        }
      }, payload);

      assert(res.status === 200, `Upload status code is 200 (Got ${res.status})`);
      assert(res.data?.success === true, 'Excel parsing succeeded');
      assert(res.data?.data?.factors?.length === 7, `Extracted all 7 factors (Got ${res.data?.data?.factors?.length})`);
    } else {
      console.log('  ⚠️ SKIP: tteesstt.xlsx not found on disk');
    }
  } catch (err) {
    assert(false, `Upload excel failed: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passedCount} / ${totalCount} PASSED (${Math.round((passedCount/totalCount)*100)}%)`);
  console.log('====================================================');

  process.exit(passedCount === totalCount ? 0 : 1);
}

runApiTestSuite().catch(err => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});
