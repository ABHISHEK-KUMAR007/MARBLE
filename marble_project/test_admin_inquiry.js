const http = require('http');

function login() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).accessToken);
        } catch(e) {
          reject(e);
        }
      });
    });
    req.write(JSON.stringify({ email: "admin@aureostone.com", password: "Admin@123" }));
    req.end();
  });
}

function getInquiries(token) {
  if (!token) return console.log('No token');
  const req = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/inquiries',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => console.log('GET Inquiries Response:', data));
  });
  req.end();
}

login().then(token => getInquiries(token)).catch(console.error);
