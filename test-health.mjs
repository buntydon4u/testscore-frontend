import http from 'http';

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));
    console.log('Body:', body.substring(0, 500));
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.end();
