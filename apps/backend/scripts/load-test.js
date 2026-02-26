import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s',
  http: {
    timeout: "60s",
    keepalive: true,
  },
};

export default function () {
  // 1️⃣ Login payload
  const payload = JSON.stringify({
    email: "trader@mixafrika.com",
    password: "password123",
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  // 2️⃣ Login call
  const loginRes = http.post(
    'http://localhost:3003/v1/auth/login',
    payload,
    { headers }
  );

  check(loginRes, {
    "login status is 200": (r) => r.status === 200,
  });

  // 3️⃣ Extract access token
  const token = loginRes.json('data.token') || loginRes.json('token');
  // Adjust key based on your API response

  // If no token, stop this VU early
  if (!token) {
    console.error("Login failed — token missing");
    return;
  }

  // 4️⃣ Auth headers
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 5️⃣ Example: wallet endpoint
  const walletRes = http.get(
    'http://localhost:3003/v1/wallet',
    { headers: authHeaders }
  );

  check(walletRes, {
    "wallet call status 200": (r) => r.status === 200,
  });



  //TODO: Add more endpoints


  // 6️⃣ Example: fund wallet
  // const fundPayload = JSON.stringify({ amount: 5000 });

  // const fundRes = http.post(
  //   'http://localhost:3003/v1/wallet',
  //   fundPayload,
  //   { headers: authHeaders }
  // );

  // check(fundRes, {
  //   "fund wallet status 200": (r) => r.status === 201,
  // });


  // 5️⃣ Example: wallet endpoint
  // const walletTransactions = http.get(
  //   'http://localhost:3003/v1/wallet/transactions',
  //   { headers: authHeaders }
  // );

  // check(walletRes, {
  //   "wallet call status 200": (r) => r.status === 200,
  // });

  sleep(1);
}
