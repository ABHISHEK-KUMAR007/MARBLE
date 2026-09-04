const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/inquiries',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("POST Response:", data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with POST request: ${e.message}`);
});

req.write(JSON.stringify({
  customerName: "Test User",
  email: "test@example.com",
  phone: "1234567890",
  city: "Test City",
  interestedProduct: "Test Product",
  message: "This is a test message"
}));
req.end();
