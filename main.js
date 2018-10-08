import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import config from './config'
import db from './db';
import router from './routes';

db.init();

const app = new Koa();

app
.use(bodyParser())
.use(router.routes())
.use(router.allowedMethods());

app.listen(config.port, () => {
  console.log(`App is listening on ${config.port} [ENV: ${process.env.NODE_ENV}]`);
});
