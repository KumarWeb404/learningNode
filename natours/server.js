const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

const DB = process.env.DATABASE_CONNECT;

mongoose.connect(DB).then(() => console.log('DB connection succesfull!'));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
