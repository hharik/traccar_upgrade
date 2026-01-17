// Test script to verify Traccar API connection
const axios = require('axios');

const TRACCAR_URL = 'http://206.81.26.158:11002';
const USERNAME = 'followtrack@followtrack.com';
const PASSWORD = 'Yamainu1999@AA_';

async function testTraccarConnection() {
  console.log('🔍 Testing Traccar API Connection...\n');

  // Test 1: Check if server is reachable
  console.log('Test 1: Checking server accessibility...');
  try {
    const response = await axios.get(TRACCAR_URL, { timeout: 5000 });
    console.log('✅ Server is reachable');
  } catch (error) {
    console.log('⚠️  Server response:', error.message);
  }

  // Test 2: Try /api/session endpoint
  console.log('\nTest 2: Testing /api/session endpoint...');
  try {
    const response = await axios.post(
      `${TRACCAR_URL}/api/session`,
      null,
      {
        params: { email: USERNAME, password: PASSWORD },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000
      }
    );
    console.log('✅ Login successful via /api/session');
    console.log('User:', response.data);
  } catch (error) {
    console.log('❌ /api/session failed:', error.response?.status, error.response?.statusText);
    console.log('Error data:', error.response?.data);
  }

  // Test 3: Try Basic Auth with /api/devices
  console.log('\nTest 3: Testing /api/devices with Basic Auth...');
  try {
    const response = await axios.get(
      `${TRACCAR_URL}/api/devices`,
      {
        auth: { username: USERNAME, password: PASSWORD },
        timeout: 10000
      }
    );
    console.log('✅ Successfully fetched devices via /api/devices');
    console.log(`Found ${response.data.length} devices`);
    if (response.data.length > 0) {
      console.log('First device:', response.data[0]);
    }
  } catch (error) {
    console.log('❌ /api/devices failed:', error.response?.status, error.response?.statusText);
    console.log('Error data:', error.response?.data);
  }

  // Test 4: Try without /api prefix
  console.log('\nTest 4: Testing without /api prefix (just /session)...');
  try {
    const response = await axios.post(
      `${TRACCAR_URL}/session`,
      null,
      {
        params: { email: USERNAME, password: PASSWORD },
        timeout: 10000
      }
    );
    console.log('✅ Login successful via /session (no /api prefix)');
    console.log('User:', response.data);
  } catch (error) {
    console.log('❌ /session failed:', error.response?.status, error.response?.statusText);
  }

  // Test 5: Try alternative authentication
  console.log('\nTest 5: Testing with form data...');
  try {
    const formData = new URLSearchParams();
    formData.append('email', USERNAME);
    formData.append('password', PASSWORD);
    
    const response = await axios.post(
      `${TRACCAR_URL}/api/session`,
      formData,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000
      }
    );
    console.log('✅ Login successful with form data');
    console.log('User:', response.data);
  } catch (error) {
    console.log('❌ Form data login failed:', error.response?.status, error.response?.statusText);
  }

  console.log('\n✅ Test completed!');
}

testTraccarConnection().catch(console.error);
