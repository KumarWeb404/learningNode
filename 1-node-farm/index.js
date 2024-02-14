const fs = require('fs');
const http = require('http');
// console.log(fs.readFileSync('./txt/start.txt', 'utf-8'));

const server = http.createServer((req, res) => {
  res.end('Welcome to the server!');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Running');
});
