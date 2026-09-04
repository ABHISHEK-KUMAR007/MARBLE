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
          resolve(JSON.parse(data).token);
        } catch(e) {
          reject(e);
        }
      });
    });
    req.write(JSON.stringify({ email: "admin@aureostone.com", password: "Admin@123" }));
    req.end();
  });
}

function createAdmin(token) {
  if (!token) return console.log('No token');
  const req = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/api/admins',
    method: 'POST',
    headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
  }, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => console.log('POST Admin Response:', res.statusCode, data));
  });
  req.write(JSON.stringify({ fullName: "New Admin", email: "newadmin@example.com", phone: "1234567890" }));
  req.end();
}

login().then(token => createAdmin(token)).catch(console.error);
