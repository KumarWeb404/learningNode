const mongoose = require('mongoose');

process.on('unhandledRejection', (err) => {
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE_CONNECT;

mongoose.connect(DB).then(() => console.log('DB connection succesfull!'));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

process.on('unhandledRejection', (err) => {
  server.close(() => {
    process.exit(1);
  });
});
