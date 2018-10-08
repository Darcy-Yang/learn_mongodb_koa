import mongoose from 'mongoose';
import config from './config';

const init = () => {
  const mongoUrl = config.mongoUrl;
  mongoose.connect(mongoUrl);
  let db = mongoose.connection;
  return new Promise((resolve, reject) => {
    db.on('error', err => {
      if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
        setTimeout(() => {
          console.log('Connecting to mongodb');
          mongoose.connect(mongoUrl);
          db = mongoose.connection;
        }, 2000);
      } else {
        reject(err);
      }
    });
    db.once('open', () => {
      console.log('Database connected');
      resolve();
    });
  });
};

export default { init };
