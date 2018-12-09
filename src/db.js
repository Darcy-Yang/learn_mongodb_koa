import mongoose from 'mongoose';

import config from './config';

mongoose.connect(config.mongoUrl);

const db = mongoose.connection;

function init() {
  db.on('error', (err) => {
    throw err;
  });

  db.once('open', () => {
    console.log('Database Connected!');
  });
}

module.exports = { init };
